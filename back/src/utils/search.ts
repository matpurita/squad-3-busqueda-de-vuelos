import { Prisma } from '@prisma/client'
import { SearchParams } from '../schemas/searchParams'
import { SearchResults } from '../schemas/searchResult'
import { Flight } from '../schemas/flight'

type FlightPayload = Prisma.FlightGetPayload<{
  include: {
    origin: true
    destination: true
    airline: true
    plane: true
  }
}>

function pairSearchResults(
  departureFlights: FlightPayload[],
  returnFlights: FlightPayload[] | null
): SearchResults[] {
  const results: SearchResults[] = []

  for (const depFlight of departureFlights) {
    if (returnFlights) {
      for (const retFlight of returnFlights) {
        results.push({
          departure: depFlight,
          return: retFlight,
          totalPrice: depFlight.price + retFlight.price
        })
      }
    } else {
      results.push({
        departure: depFlight,
        totalPrice: depFlight.price
      })
    }
  }

  return results
}

function getFlightDuration(flight: Flight) {
  return (flight.arrival.getTime() - flight.departure.getTime()) / (1000 * 60) // duration in minutes
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
            getFlightDuration(a.departure) +
            getFlightDuration(a.return) -
            (getFlightDuration(b.departure) + getFlightDuration(b.return))
          )
        } else {
          return getFlightDuration(a.departure) - getFlightDuration(b.departure)
        }
      case 'duration_desc':
        if (a.return && b.return) {
          return (
            getFlightDuration(b.departure) +
            getFlightDuration(b.return) -
            (getFlightDuration(a.departure) + getFlightDuration(a.return))
          )
        } else {
          return getFlightDuration(b.departure) - getFlightDuration(a.departure)
        }
      default:
        return a.totalPrice - b.totalPrice
    }
  })
}

export { pairSearchResults, getFlightDuration, sortSearchResults }
