import { NextFunction, Request, Response } from 'express'
import { searchParamsSchema } from '../schemas/searchParams'
import { ZodError } from 'zod'
import { AppError } from '../middlewares/error'
import { prisma } from '../prisma/db'
import { add, startOfDay, endOfDay, sub } from 'date-fns'
import { Pagination } from '../schemas/pagination'
import { pairSearchResults, sortSearchResults } from '../utils/search'
import { bookingIntentSchema } from '../schemas/bookingIntent'
import { searchMetricSchema } from '../schemas/searchMetric'
import { postEvent } from '../kafka/kafka'

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
    const departurePromise = prisma.flight.findMany({
      where: {
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
      },
      include: {
        origin: true,
        destination: true,
        airline: true,
        plane: true,
        _count: {
          select: { bookings: true }
        }
      }
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
      ? prisma.flight.findMany({
          where: {
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
          },
          include: {
            origin: true,
            destination: true,
            airline: true,
            plane: true,
            _count: {
              select: { bookings: true }
            }
          }
        })
      : null

    const [departureFlights, returnFlights] = await Promise.all([departurePromise, returnPromise])

    const filterBySeats = (flights: typeof departureFlights) =>
      flights.filter((flight) => {
        const availableSeats = flight.plane?.capacity ?? 50 - flight._count.bookings
        return availableSeats >= searchParams.passengers
      })

    const filteredDepartureFlights = filterBySeats(departureFlights)
    const filteredReturnFlights = returnFlights ? filterBySeats(returnFlights) : null

    const searchResults = pairSearchResults(filteredDepartureFlights, filteredReturnFlights)

    const sortedResults = sortSearchResults(searchResults, searchParams.sort)

    const searchMetric = searchMetricSchema.parse({
      userId: req.user?.userId,
      flightsTo: searchParams.destination.toUpperCase(),
      flightsFrom: searchParams.origin.toUpperCase(),
      departureDate: searchParams.departureDate,
      returnDate: searchParams.returnDate,
      resultsCount: sortedResults.length,
      timestamp: new Date()
    })

    prisma.searchMetrics.create({ data: searchMetric })

    await postEvent('search.search.performed', searchMetric)

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

async function sendBookingIntent(req: Request, res: Response, next: NextFunction) {
  try {
    const flightBooking = bookingIntentSchema.parse({
      userId: req.body.userId,
      flightId: req.body.flightId,
      addedAt: req.body.addedAt ? new Date(req.body.addedAt) : undefined
    })

    await prisma.bookingIntent.create({
      data: flightBooking
    })

    postEvent('search.cart.item.added', flightBooking)

    res.status(201).json({ message: 'Booking recorded successfully' })
  } catch (error) {
    next(error)
  }
}

export default {
  searchFlights,
  getFlightSuggestions,
  sendBookingIntent
}
