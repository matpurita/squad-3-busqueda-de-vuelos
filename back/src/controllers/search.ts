import { NextFunction, Request, Response } from 'express'
import { searchSchema } from '../schemas/searchParams'
import { ZodError } from 'zod'
import { AppError } from '../middlewares/error'
import { prisma } from '../prisma/db'
import { add, startOfDay, endOfDay, sub } from 'date-fns'
import { Prisma } from '@prisma/client'

async function searchFlights(req: Request, res: Response, next: NextFunction) {
  try {
    const searchParams = searchSchema.parse({
      origin: req.query.origin,
      destination: req.query.destination,
      departureDate: req.query.departureDate,
      departureRange: req.query.departureRange,
      returnDate: req.query.returnDate,
      returnRange: req.query.returnRange,
      passengers: req.query.passengers,
      cabinClass: req.query.cabinClass,
      nonStop: req.query.nonStop,
      currency: req.query.currency,
      sort: req.query.sort,
      limit: req.query.limit,
      offset: req.query.offset
    })

    const departureDateStart = startOfDay(
      sub(new Date(searchParams.departureDate), {
        days: searchParams.departureRange
      })
    )
    const departureDateEnd = endOfDay(
      add(new Date(searchParams.departureDate), {
        days: searchParams.departureRange
      })
    )
    console.log('Searching flights from', departureDateStart, 'to', departureDateEnd)

    // Query seats first
    const availableSeats = await prisma.seats.findMany({
      where: {
        isAvailable: true,
        class: searchParams.cabinClass,
        flight: {
          origin: {
            code: searchParams.origin.toUpperCase()
          },
          destination: {
            code: searchParams.destination.toUpperCase()
          },
          departure: {
            gte: departureDateStart,
            lte: departureDateEnd
          }
        }
      },
      include: {
        flight: {
          include: {
            origin: true,
            destination: true,
            airline: true
          }
        }
      },
      orderBy: getSortOptions(searchParams.sort),
      take: searchParams.limit,
      skip: searchParams.offset
    })

    // Get total count
    const totalSeats = await prisma.seats.count({
      where: {
        isAvailable: true,
        class: searchParams.cabinClass,
        flight: {
          origin: {
            code: searchParams.origin.toUpperCase()
          },
          destination: {
            code: searchParams.destination.toUpperCase()
          },
          departure: {
            gte: departureDateStart,
            lte: departureDateEnd
          }
        }
      }
    })

    // Group seats by flight and format response
    const flightMap = new Map()
    availableSeats.forEach((seat) => {
      const flight = seat.flight
      if (!flightMap.has(flight.id)) {
        flightMap.set(flight.id, {
          id: flight.id,
          flightNumber: flight.flightNumber,
          departure: flight.departure,
          arrival: flight.arrival,
          duration: flight.durationMins,
          origin: {
            code: flight.origin.code,
            city: flight.origin.city,
            country: flight.origin.country
          },
          destination: {
            code: flight.destination.code,
            city: flight.destination.city,
            country: flight.destination.country
          },
          airline: {
            code: flight.airline.code,
            name: flight.airline.name
          },
          minPrice: seat.price, // Initialize with first seat price
          availableSeats: 1,
          currency: searchParams.currency,
          seats: [{ price: seat.price, seatNumber: seat.seatNumber }]
        })
      } else {
        const existingFlight = flightMap.get(flight.id)
        existingFlight.availableSeats++
        existingFlight.seats.push({ price: seat.price, seatNumber: seat.seatNumber })
        existingFlight.minPrice = Math.min(existingFlight.minPrice, seat.price)
      }
    })

    const formattedFlights = Array.from(flightMap.values())

    res.json({
      flights: formattedFlights,
      pagination: {
        total: Math.ceil(totalSeats / searchParams.passengers), // Convert seat count to flight count
        limit: searchParams.limit,
        offset: searchParams.offset
      }
    })
  } catch (error) {
    if (error instanceof ZodError) {
      next(new AppError(error.message, 400))
      return
    }
    next(error)
  }
}

function getSortOptions(sort?: string): Prisma.SeatsOrderByWithRelationInput {
  switch (sort) {
    case 'price_asc':
      return { price: 'asc' }
    case 'price_desc':
      return { price: 'desc' }
    case 'duration_asc':
      return { flight: { durationMins: 'asc' } }
    case 'duration_desc':
      return { flight: { durationMins: 'desc' } }
    default:
      return { flight: { departure: 'asc' } }
  }
}

export default { searchFlights }
