import { Prisma } from '@prisma/client'
import { SearchParams } from '../schemas/searchParams'
import { Flight } from '../schemas/flight'
import { SearchResults } from '../schemas/searchResult'
import { Class } from '../schemas/class'

type SeatPayload = Prisma.SeatsGetPayload<{
  include: {
    class: true
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
  const { flight: flightData, class: clazz, ...selectedSeat } = seat
  const { seats, ...flight } = flightData
  const body: Flight = {
    ...flight,
    minPrice: seats.sort((a, b) => a.price - b.price)[0]?.price,
    currency: 'USD',
    availableSeats: seats.length,
    selectedSeat: {
      class: clazz as Class,
      ...selectedSeat
    }
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

  return results
}

function sortSearchResults(searchResults: SearchResults[], sort: SearchParams['sort']) {
  return searchResults.sort((a, b) => {
    switch (sort) {
      case 'price_asc':
        return a.totalPrice - b.totalPrice
      case 'price_desc':
        return b.totalPrice - a.totalPrice
      case 'duration_asc':
        if (a.return && b.return) {
          return (
            a.departure.duration + a.return.duration - (b.departure.duration + b.return.duration)
          )
        } else {
          return a.departure.duration - b.departure.duration
        }
      case 'duration_desc':
        if (a.return && b.return) {
          return (
            b.departure.duration + b.return.duration - (a.departure.duration + a.return.duration)
          )
        } else {
          return b.departure.duration - a.departure.duration
        }
      default:
        return a.totalPrice - b.totalPrice
    }
  })
}

export { getSortOptions, seatToFlight, pairSearchResults, sortSearchResults }
