import { Prisma } from '@prisma/client'
import { SearchParams } from '../schemas/searchParams'
import { Flight } from '../schemas/flight'
import { SearchResults } from '../schemas/searchResult'

type SeatPayload = Prisma.SeatsGetPayload<{
  include: {
    flight: {
      include: {
        origin: true
        destination: true
        airline: true
        seats: {
          where: {
            isAvailable: true
          }
        }
      }
    }
  }
}>

function getSortOptions(sort?: SearchParams['sort']): Prisma.SeatsOrderByWithRelationInput {
  switch (sort) {
    case 'price_asc':
      return { price: 'asc' }
    case 'price_desc':
      return { price: 'desc' }
    case 'duration_asc':
      return { flight: { duration: 'asc' } }
    case 'duration_desc':
      return { flight: { duration: 'desc' } }
    default:
      return { price: 'asc' }
  }
}

function seatToFlight(seat: SeatPayload) {
  const { flight: flightData, ...selectedSeat } = seat
  const { seats, ...flight } = flightData
  const body: Flight = {
    ...flight,
    minPrice: seats.sort((a, b) => a.price - b.price)[0]?.price,
    currency: 'USD',
    availableSeats: seats.length,
    selectedSeat
  }

  return body
}

function pairSearchResults(
  departureSeats: SeatPayload[],
  returnSeats: SeatPayload[] | null
): SearchResults[] {
  const results: SearchResults[] = []

  for (const depSeat of departureSeats) {
    if (returnSeats) {
      for (const retSeat of returnSeats) {
        results.push({
          departure: seatToFlight(depSeat),
          return: seatToFlight(retSeat),
          totalPrice: depSeat.price + retSeat.price
        })
      }
    } else {
      results.push({
        departure: seatToFlight(depSeat),
        totalPrice: depSeat.price
      })
    }
  }

  results.sort((a, b) => a.totalPrice - b.totalPrice)

  return results
}

export { getSortOptions, seatToFlight, pairSearchResults }
