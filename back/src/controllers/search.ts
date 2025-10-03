import { NextFunction, Request, Response } from 'express'
import { searchParamsSchema } from '../schemas/searchParams'
import { ZodError } from 'zod'
import { AppError } from '../middlewares/error'
import { prisma } from '../prisma/db'
import { add, startOfDay, endOfDay, sub } from 'date-fns'
import { Pagination } from '../schemas/pagination'
import { getSortOptions, pairSearchResults, sortSearchResults } from '../utils/search'
import { flightBookingSchema } from '../schemas/flightBooking'

async function searchFlights(req: Request, res: Response, next: NextFunction) {
  try {
    const searchParams = searchParamsSchema.parse({
      origin: req.query.origin,
      destination: req.query.destination,
      departureDate: req.query.departureDate,
      departureRange: req.query.departureRange,
      returnDate: req.query.returnDate,
      returnRange: req.query.returnRange,
      passengers: req.query.passengers,
      cabinClass: req.query.cabinClass,
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

    // Query seats first
    const departurePromise = prisma.seats.findMany({
      where: {
        isAvailable: true,
        class: searchParams.cabinClass ? { name: searchParams.cabinClass } : undefined,
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
        class: true,
        flight: {
          include: {
            origin: true,
            destination: true,
            airline: true,
            seats: {
              where: { isAvailable: true }
            }
          }
        }
      },
      orderBy: getSortOptions(searchParams.sort)
    })

    const returnDateStart = searchParams.returnDate
      ? startOfDay(
          sub(new Date(searchParams.returnDate), {
            days: searchParams.returnRange
          })
        )
      : null
    const returnDateEnd = searchParams.returnDate
      ? endOfDay(
          add(new Date(searchParams.returnDate), {
            days: searchParams.returnRange
          })
        )
      : null

    const returnPromise = searchParams.returnDate
      ? prisma.seats.findMany({
          where: {
            isAvailable: true,
            class: searchParams.cabinClass ? { name: searchParams.cabinClass } : undefined,
            flight: {
              origin: {
                code: searchParams.destination.toUpperCase()
              },
              destination: {
                code: searchParams.origin.toUpperCase()
              },
              departure: {
                gte: returnDateStart!,
                lte: returnDateEnd!
              }
            }
          },
          include: {
            class: true,
            flight: {
              include: {
                origin: true,
                destination: true,
                airline: true,
                seats: {
                  where: { isAvailable: true }
                }
              }
            }
          },
          orderBy: getSortOptions(searchParams.sort)
        })
      : null

    let [departureSeats, returnSeats] = await Promise.all([departurePromise, returnPromise])

    if (searchParams.passengers) {
      departureSeats = departureSeats.filter(
        (seat) => seat.flight.seats.length >= searchParams.passengers
      )
      returnSeats =
        returnSeats?.filter((seat) => seat.flight.seats.length >= searchParams.passengers) ?? null
    }

    const searchResults = pairSearchResults(departureSeats, returnSeats)

    const sortedResults = sortSearchResults(searchResults, searchParams.sort)

    const pagination: Pagination = {
      total: sortedResults.length,
      limit: searchParams.limit,
      offset: searchParams.offset
    }

    const response = {
      results: sortedResults.slice(searchParams.offset, searchParams.offset + searchParams.limit),
      pagination
    }

    res.json(response)
  } catch (error) {
    if (error instanceof ZodError) {
      next(new AppError(error.message, 400))
      return
    }
    next(error)
  }
}

async function getFlightSuggestions(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query.q as string

    if (!query || query.length < 2) {
      return res.json({ suggestions: [] })
    }

    const suggestions = await prisma.flight.findMany({
      where: {
        OR: [
          {
            origin: {
              OR: [
                { code: { contains: query.toUpperCase(), mode: 'insensitive' } },
                { city: { contains: query, mode: 'insensitive' } },
                { country: { contains: query, mode: 'insensitive' } }
              ]
            }
          },
          {
            destination: {
              OR: [
                { code: { contains: query.toUpperCase(), mode: 'insensitive' } },
                { city: { contains: query, mode: 'insensitive' } },
                { country: { contains: query, mode: 'insensitive' } }
              ]
            }
          },
          {
            airline: {
              OR: [
                { code: { contains: query.toUpperCase(), mode: 'insensitive' } },
                { name: { contains: query, mode: 'insensitive' } }
              ]
            }
          }
        ]
      },
      select: {
        id: true,
        flightNumber: true,
        departure: true,
        arrival: true,
        airline: {
          select: {
            code: true,
            name: true
          }
        },
        origin: {
          select: {
            code: true,
            city: true,
            country: true
          }
        },
        destination: {
          select: {
            code: true,
            city: true,
            country: true
          }
        }
      },
      distinct: ['flightNumber'],
      take: 10
    })

    res.json({
      suggestions: suggestions.map((flight) => ({
        id: flight.id,
        flightNumber: flight.flightNumber,
        label: `${flight.airline.code}${flight.flightNumber} - ${flight.origin.city} (${flight.origin.code}) to ${flight.destination.city} (${flight.destination.code})`,
        departure: flight.departure,
        arrival: flight.arrival,
        airline: flight.airline,
        origin: flight.origin,
        destination: flight.destination
      }))
    })
  } catch (error) {
    next(error)
  }
}

async function sendFlightBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const flightBooking = flightBookingSchema.parse({
      userId: req.body.userId,
      flightId: req.body.flightId,
      direction: req.body.direction,
      timestamp: req.body.timestamp
    })

    await prisma.flightBookings.create({
      data: flightBooking
    })

    // await fetch('[CORE]', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(flightBooking)
    // })

    res.status(201).json({ message: 'Booking recorded successfully' })
  } catch (error) {
    next(error)
  }
}

export default {
  searchFlights,
  getFlightSuggestions,
  sendFlightBooking
}
