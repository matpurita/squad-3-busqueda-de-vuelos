import { pairSearchResults, getFlightDuration, sortSearchResults } from './search'
import { Prisma } from '@prisma/client'

type FlightPayload = Prisma.FlightGetPayload<{
  include: {
    origin: true
    destination: true
    airline: true
    plane: true
  }
}>

describe('search utilities', () => {
  const mockFlight1: FlightPayload = {
    id: '1',
    flightNumber: 'AA100',
    originId: 'JFK',
    destinationId: 'LAX',
    airlineId: 'AA',
    planeId: 'B737',
    departure: new Date('2025-12-01T10:00:00Z'),
    arrival: new Date('2025-12-01T16:00:00Z'),
    status: 'SCHEDULED',
    price: 300,
    currency: 'USD',
    origin: {
      id: 'jfk-1',
      code: 'JFK',
      city: 'New York',
      country: 'USA',
      name: 'John F. Kennedy International Airport'
    },
    destination: {
      id: 'lax-1',
      code: 'LAX',
      city: 'Los Angeles',
      country: 'USA',
      name: 'Los Angeles International Airport'
    },
    airline: {
      id: 'aa-1',
      code: 'AA',
      name: 'American Airlines'
    },
    plane: {
      id: 'b737-1',
      model: 'B737',
      capacity: 180
    }
  }

  const mockFlight2: FlightPayload = {
    ...mockFlight1,
    id: '2',
    flightNumber: 'AA101',
    departure: new Date('2025-12-01T14:00:00Z'),
    arrival: new Date('2025-12-01T20:00:00Z'),
    price: 350
  }

  const mockReturnFlight: FlightPayload = {
    ...mockFlight1,
    id: '3',
    flightNumber: 'AA200',
    originId: 'LAX',
    destinationId: 'JFK',
    departure: new Date('2025-12-05T10:00:00Z'),
    arrival: new Date('2025-12-05T18:00:00Z'),
    price: 320,
    origin: {
      id: 'lax-1',
      code: 'LAX',
      city: 'Los Angeles',
      country: 'USA',
      name: 'Los Angeles International Airport'
    },
    destination: {
      id: 'jfk-1',
      code: 'JFK',
      city: 'New York',
      country: 'USA',
      name: 'John F. Kennedy International Airport'
    }
  }

  describe('pairSearchResults', () => {
    it('should pair departure and return flights when both exist', () => {
      const results = pairSearchResults([mockFlight1, mockFlight2], [mockReturnFlight])

      expect(results).toHaveLength(2)
      expect(results[0]).toEqual({
        departure: mockFlight1,
        return: mockReturnFlight,
        totalPrice: mockFlight1.price + mockReturnFlight.price
      })
      expect(results[1]).toEqual({
        departure: mockFlight2,
        return: mockReturnFlight,
        totalPrice: mockFlight2.price + mockReturnFlight.price
      })
    })

    it('should create one-way results when return flights array is null', () => {
      const results = pairSearchResults([mockFlight1, mockFlight2], null)

      expect(results).toHaveLength(2)
      expect(results[0]).toEqual({
        departure: mockFlight1,
        totalPrice: mockFlight1.price
      })
      expect(results[1]).toEqual({
        departure: mockFlight2,
        totalPrice: mockFlight2.price
      })
    })

    it('should create partial results when departure exists but return is empty array', () => {
      const results = pairSearchResults([mockFlight1], [])

      expect(results).toHaveLength(1)
      expect(results[0]).toEqual({
        departure: mockFlight1,
        return: null,
        totalPrice: mockFlight1.price
      })
    })

    it('should create return-only results when departure is empty', () => {
      const results = pairSearchResults([], [mockReturnFlight])

      expect(results).toHaveLength(1)
      expect(results[0]).toEqual({
        departure: null,
        return: mockReturnFlight,
        totalPrice: mockReturnFlight.price
      })
    })

    it('should return empty array when both are empty', () => {
      const results = pairSearchResults([], [])

      expect(results).toHaveLength(0)
    })

    it('should create multiple pairs for multiple return flights', () => {
      const mockReturnFlight2 = { ...mockReturnFlight, id: '4', price: 340 }
      const results = pairSearchResults([mockFlight1], [mockReturnFlight, mockReturnFlight2])

      expect(results).toHaveLength(2)
      expect(results[0].totalPrice).toBe(620)
      expect(results[1].totalPrice).toBe(640)
    })
  })

  describe('getFlightDuration', () => {
    it('should calculate flight duration in minutes', () => {
      const duration = getFlightDuration(mockFlight1)
      // 6 hours = 360 minutes
      expect(duration).toBe(360)
    })

    it('should return 0 for null flight', () => {
      const duration = getFlightDuration(null)
      expect(duration).toBe(0)
    })

    it('should handle flights with different durations', () => {
      const shortFlight = {
        ...mockFlight1,
        departure: new Date('2025-12-01T10:00:00Z'),
        arrival: new Date('2025-12-01T11:30:00Z')
      }
      const duration = getFlightDuration(shortFlight)
      // 1.5 hours = 90 minutes
      expect(duration).toBe(90)
    })
  })

  describe('sortSearchResults', () => {
    const result1 = {
      departure: mockFlight1,
      return: mockReturnFlight,
      totalPrice: 620
    }

    const result2 = {
      departure: mockFlight2,
      return: mockReturnFlight,
      totalPrice: 670
    }

    const shortFlight = {
      ...mockFlight1,
      id: '5',
      departure: new Date('2025-12-01T10:00:00Z'),
      arrival: new Date('2025-12-01T12:00:00Z'), // 2 hours
      price: 400
    }

    const result3 = {
      departure: shortFlight,
      return: null,
      totalPrice: 400
    }

    it('should sort by price ascending', () => {
      const sorted = sortSearchResults([result2, result1, result3], 'price_asc')
      
      expect(sorted[0].totalPrice).toBe(400)
      expect(sorted[1].totalPrice).toBe(620)
      expect(sorted[2].totalPrice).toBe(670)
    })

    it('should sort by price descending', () => {
      const sorted = sortSearchResults([result1, result3, result2], 'price_desc')
      
      expect(sorted[0].totalPrice).toBe(670)
      expect(sorted[1].totalPrice).toBe(620)
      expect(sorted[2].totalPrice).toBe(400)
    })

    it('should sort by duration ascending for round trips', () => {
      const sorted = sortSearchResults([result2, result1], 'duration_asc')
      
      // result1: 6h + 8h = 14h = 840 min
      // result2: 6h + 8h = 14h = 840 min
      // Both have same duration, so order should be preserved
      expect(sorted).toHaveLength(2)
    })

    it('should sort by duration descending for round trips', () => {
      const sorted = sortSearchResults([result1, result2], 'duration_desc')
      
      expect(sorted).toHaveLength(2)
    })

    it('should sort by duration ascending for one-way flights', () => {
      const result4 = { ...result3, totalPrice: 500 }
      const sorted = sortSearchResults([result3, result4], 'duration_asc')
      
      expect(sorted).toHaveLength(2)
    })

    it('should sort by duration descending for one-way flights', () => {
      const longFlight = {
        ...mockFlight1,
        departure: new Date('2025-12-01T10:00:00Z'),
        arrival: new Date('2025-12-01T20:00:00Z') // 10 hours
      }
      const result4 = {
        departure: longFlight,
        return: null,
        totalPrice: 450
      }
      
      const sorted = sortSearchResults([result3, result4], 'duration_desc')
      
      expect(getFlightDuration(sorted[0].departure)).toBeGreaterThan(getFlightDuration(sorted[1].departure))
    })

    it('should default to price ascending for unknown sort option', () => {
      const sorted = sortSearchResults([result2, result1], undefined)
      
      expect(sorted[0].totalPrice).toBe(620)
      expect(sorted[1].totalPrice).toBe(670)
    })
  })
})
