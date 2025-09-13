import { NextFunction, Request, Response } from 'express'
import { searchSchema } from '../schemas/searchParams'
import { ZodError } from 'zod'
import { AppError } from '../middlewares/error'
import { prisma } from '../prisma/db'
import { add, startOfDay, endOfDay, sub } from 'date-fns'
import { Pagination } from '../schemas/pagination'
import { getSortOptions, pairSearchResults } from '../utils/search'

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

    const pagination: Pagination = {
      total: searchResults.length,
      limit: searchParams.limit,
      offset: searchParams.offset
    }

    const response = {
      results: searchResults.slice(searchParams.offset, searchParams.offset + searchParams.limit),
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

export default { searchFlights }
