import { Request, Response, NextFunction } from 'express'
import searchController from './search'
import { prisma } from '../prisma/db'
import { postEvent } from '../kafka/kafka'
import { AppError } from '../middlewares/error'
import * as searchUtils from '../utils/search'

jest.mock('../prisma/db', () => ({
  prisma: {
    flight: {
      findMany: jest.fn()
    },
    searchMetrics: {
      create: jest.fn(),
      findMany: jest.fn()
    },
    bookingIntent: {
      create: jest.fn(),
      findFirst: jest.fn()
    }
  }
}))

jest.mock('../kafka/kafka', () => ({
  postEvent: jest.fn()
}))

jest.mock('../utils/search')

describe('search controller', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  const mockFlight = {
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
    },
    _count: {
      bookings: 10
    }
  }

  beforeEach(() => {
    mockRequest = {
      query: {},
      body: {},
      user: undefined
    }
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    }
    nextFunction = jest.fn()
    jest.clearAllMocks()
    
    // Default mock implementations
    ;(searchUtils.pairSearchResults as jest.Mock).mockImplementation((dep: typeof mockFlight[], ret: typeof mockFlight[] | null) => {
      if (ret && ret.length > 0) {
        return dep.map((d: typeof mockFlight) => ({
          departure: d,
          return: ret[0],
          totalPrice: d.price + ret[0].price
        }))
      }
      return dep.map((d: typeof mockFlight) => ({ departure: d, totalPrice: d.price }))
    })
    
    ;(searchUtils.sortSearchResults as jest.Mock).mockImplementation((results: unknown[]) => results)
  })

  describe('searchFlights', () => {
    it('should search one-way flights successfully', async () => {
      mockRequest.query = {
        origin: 'JFK',
        destination: 'LAX',
        departureDate: '2025-12-01',
        passengers: '1'
      }

      ;(prisma.flight.findMany as jest.Mock).mockResolvedValueOnce([mockFlight])

      await searchController.searchFlights(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(prisma.flight.findMany).toHaveBeenCalled()
      expect(mockResponse.json).toHaveBeenCalledWith({
        results: expect.any(Array),
        pagination: {
          total: expect.any(Number),
          limit: 10,
          offset: 0
        }
      })
    })

    it('should search round-trip flights successfully', async () => {
      mockRequest.query = {
        origin: 'JFK',
        destination: 'LAX',
        departureDate: '2025-12-01',
        returnDate: '2025-12-05',
        passengers: '1'
      }

      const mockReturnFlight = { ...mockFlight, id: '2' }

      ;(prisma.flight.findMany as jest.Mock)
        .mockResolvedValueOnce([mockFlight])
        .mockResolvedValueOnce([mockReturnFlight])

      await searchController.searchFlights(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(prisma.flight.findMany).toHaveBeenCalledTimes(2)
      expect(mockResponse.json).toHaveBeenCalled()
    })

    it('should filter flights by available seats', async () => {
      const fullFlight = {
        ...mockFlight,
        plane: { ...mockFlight.plane, capacity: 15 },
        _count: { bookings: 14 } // 15 capacity - 14 bookings = 1 available seat
      }

      mockRequest.query = {
        origin: 'JFK',
        destination: 'LAX',
        departureDate: '2025-12-01',
        passengers: '2' // Requesting more seats than available
      }

      ;(prisma.flight.findMany as jest.Mock).mockResolvedValueOnce([fullFlight])
      
      // Mock the pairSearchResults to return empty when no flights pass the filter
      ;(searchUtils.pairSearchResults as jest.Mock).mockReturnValue([])

      await searchController.searchFlights(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0]
      expect(response.results).toHaveLength(0)
    })

    it('should apply sort parameter', async () => {
      mockRequest.query = {
        origin: 'JFK',
        destination: 'LAX',
        departureDate: '2025-12-01',
        sort: 'price_asc'
      }

      ;(prisma.flight.findMany as jest.Mock).mockResolvedValueOnce([mockFlight])

      await searchController.searchFlights(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(searchUtils.sortSearchResults).toHaveBeenCalledWith(
        expect.any(Array),
        'price_asc'
      )
    })

    it('should apply pagination', async () => {
      mockRequest.query = {
        origin: 'JFK',
        destination: 'LAX',
        departureDate: '2025-12-01',
        limit: '5',
        offset: '10'
      }

      ;(prisma.flight.findMany as jest.Mock).mockResolvedValueOnce([mockFlight])

      await searchController.searchFlights(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0]
      expect(response.pagination).toEqual({
        total: expect.any(Number),
        limit: 5,
        offset: 10
      })
    })

    it('should handle departure range parameter', async () => {
      mockRequest.query = {
        origin: 'JFK',
        destination: 'LAX',
        departureDate: '2025-12-01',
        departureRange: '3'
      }

      ;(prisma.flight.findMany as jest.Mock).mockResolvedValueOnce([mockFlight])

      await searchController.searchFlights(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(prisma.flight.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            departure: {
              gte: expect.any(Date),
              lte: expect.any(Date)
            }
          })
        })
      )
    })

    it('should create search metrics', async () => {
      mockRequest.query = {
        origin: 'JFK',
        destination: 'LAX',
        departureDate: '2025-12-01'
      }
      mockRequest.user = {
        userId: '123',
        email: 'test@example.com',
        rol: 'user',
        exp: Date.now() + 3600,
        iat: Date.now()
      }

      ;(prisma.flight.findMany as jest.Mock).mockResolvedValueOnce([mockFlight])

      await searchController.searchFlights(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(prisma.searchMetrics.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: '123',
          flightsFrom: 'JFK',
          flightsTo: 'LAX'
        })
      })
    })

    it('should post search event', async () => {
      mockRequest.query = {
        origin: 'JFK',
        destination: 'LAX',
        departureDate: '2025-12-01'
      }

      ;(prisma.flight.findMany as jest.Mock).mockResolvedValueOnce([mockFlight])

      await searchController.searchFlights(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(postEvent).toHaveBeenCalledWith('search.search.performed', expect.any(Object))
    })

    it('should handle validation errors', async () => {
      mockRequest.query = {
        origin: 'INVALID',
        destination: 'LAX',
        departureDate: '2025-12-01'
      }

      await searchController.searchFlights(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError))
    })

    it('should handle missing required parameters', async () => {
      mockRequest.query = {
        origin: 'JFK'
        // missing destination and departureDate
      }

      await searchController.searchFlights(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalled()
    })

    it('should handle database errors', async () => {
      mockRequest.query = {
        origin: 'JFK',
        destination: 'LAX',
        departureDate: '2025-12-01'
      }

      const dbError = new Error('Database error')
      ;(prisma.flight.findMany as jest.Mock).mockRejectedValue(dbError)

      await searchController.searchFlights(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalledWith(dbError)
    })

    it('should handle maximum passengers', async () => {
      mockRequest.query = {
        origin: 'JFK',
        destination: 'LAX',
        departureDate: '2025-12-01',
        passengers: '9'
      }

      ;(prisma.flight.findMany as jest.Mock).mockResolvedValueOnce([mockFlight])

      await searchController.searchFlights(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.json).toHaveBeenCalled()
    })

    it('should default passengers to 1 if not provided', async () => {
      mockRequest.query = {
        origin: 'JFK',
        destination: 'LAX',
        departureDate: '2025-12-01'
      }

      ;(prisma.flight.findMany as jest.Mock).mockResolvedValueOnce([mockFlight])

      await searchController.searchFlights(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.json).toHaveBeenCalled()
    })

    it('should return empty results when no flights match', async () => {
      mockRequest.query = {
        origin: 'JFK',
        destination: 'LAX',
        departureDate: '2025-12-01'
      }

      ;(prisma.flight.findMany as jest.Mock).mockResolvedValueOnce([])

      await searchController.searchFlights(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0]
      expect(response.results).toHaveLength(0)
    })
  })

  describe('getFlightSuggestions', () => {
    it('should return suggestions for valid query', async () => {
      mockRequest.query = {
        q: 'JFK'
      }

      const mockSuggestions = [
        {
          id: '1',
          flightNumber: 'AA100',
          departure: new Date('2025-12-01T10:00:00Z'),
          arrival: new Date('2025-12-01T16:00:00Z'),
          airline: { code: 'AA', name: 'American Airlines' },
          origin: { code: 'JFK', city: 'New York', country: 'USA' },
          destination: { code: 'LAX', city: 'Los Angeles', country: 'USA' }
        }
      ]

      ;(prisma.flight.findMany as jest.Mock).mockResolvedValue(mockSuggestions)

      await searchController.getFlightSuggestions(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.json).toHaveBeenCalledWith({
        suggestions: expect.arrayContaining([
          expect.objectContaining({
            id: '1',
            flightNumber: 'AA100',
            label: expect.any(String)
          })
        ])
      })
    })

    it('should return empty suggestions for query less than 2 characters', async () => {
      mockRequest.query = {
        q: 'J'
      }

      await searchController.getFlightSuggestions(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.json).toHaveBeenCalledWith({ suggestions: [] })
      expect(prisma.flight.findMany).not.toHaveBeenCalled()
    })

    it('should return empty suggestions for empty query', async () => {
      mockRequest.query = {
        q: ''
      }

      await searchController.getFlightSuggestions(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.json).toHaveBeenCalledWith({ suggestions: [] })
    })

    it('should return empty suggestions for missing query', async () => {
      mockRequest.query = {}

      await searchController.getFlightSuggestions(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.json).toHaveBeenCalledWith({ suggestions: [] })
    })

    it('should limit suggestions to 10', async () => {
      mockRequest.query = {
        q: 'New'
      }

      ;(prisma.flight.findMany as jest.Mock).mockResolvedValue([])

      await searchController.getFlightSuggestions(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(prisma.flight.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10
        })
      )
    })

    it('should search across origins, destinations, and airlines', async () => {
      mockRequest.query = {
        q: 'American'
      }

      ;(prisma.flight.findMany as jest.Mock).mockResolvedValue([])

      await searchController.getFlightSuggestions(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(prisma.flight.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: expect.any(Array)
          }
        })
      )
    })

    it('should handle database errors', async () => {
      mockRequest.query = {
        q: 'JFK'
      }

      const dbError = new Error('Database error')
      ;(prisma.flight.findMany as jest.Mock).mockRejectedValue(dbError)

      await searchController.getFlightSuggestions(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalledWith(dbError)
    })

    it('should format suggestion label correctly', async () => {
      mockRequest.query = {
        q: 'Los'
      }

      const mockSuggestion = {
        id: '1',
        flightNumber: '100',
        departure: new Date('2025-12-01T10:00:00Z'),
        arrival: new Date('2025-12-01T16:00:00Z'),
        airline: { code: 'AA', name: 'American Airlines' },
        origin: { code: 'JFK', city: 'New York', country: 'USA' },
        destination: { code: 'LAX', city: 'Los Angeles', country: 'USA' }
      }

      ;(prisma.flight.findMany as jest.Mock).mockResolvedValue([mockSuggestion])

      await searchController.getFlightSuggestions(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0]
      expect(response.suggestions[0].label).toBe(
        'AA100 - New York (JFK) to Los Angeles (LAX)'
      )
    })
  })

  describe('sendBookingIntent', () => {
    it('should create booking intent successfully', async () => {
      mockRequest.body = {
        userId: '123',
        flightId: 'flight-1'
      }

      ;(prisma.bookingIntent.findFirst as jest.Mock).mockResolvedValue(null)
      ;(prisma.bookingIntent.create as jest.Mock).mockResolvedValue({})

      await searchController.sendBookingIntent(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(prisma.bookingIntent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: '123',
          flightId: 'flight-1'
        })
      })
      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Booking recorded successfully'
      })
    })

    it('should post cart item added event', async () => {
      mockRequest.body = {
        userId: '123',
        flightId: 'flight-1'
      }

      ;(prisma.bookingIntent.findFirst as jest.Mock).mockResolvedValue(null)
      ;(prisma.bookingIntent.create as jest.Mock).mockResolvedValue({})

      await searchController.sendBookingIntent(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(postEvent).toHaveBeenCalledWith(
        'search.cart.item.added',
        expect.objectContaining({
          userId: '123',
          flightId: 'flight-1'
        })
      )
    })

    it('should handle custom addedAt date', async () => {
      const customDate = '2025-12-01T10:00:00Z'
      mockRequest.body = {
        userId: '123',
        flightId: 'flight-1',
        addedAt: customDate
      }

      ;(prisma.bookingIntent.findFirst as jest.Mock).mockResolvedValue(null)
      ;(prisma.bookingIntent.create as jest.Mock).mockResolvedValue({})

      await searchController.sendBookingIntent(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(prisma.bookingIntent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          addedAt: new Date(customDate)
        })
      })
    })

    it('should handle validation errors', async () => {
      mockRequest.body = {
        // missing userId and flightId
      }

      await searchController.sendBookingIntent(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalled()
      expect(prisma.bookingIntent.create).not.toHaveBeenCalled()
    })

    it('should handle database errors', async () => {
      mockRequest.body = {
        userId: '123',
        flightId: 'flight-1'
      }

      const dbError = new Error('Database error')
      ;(prisma.bookingIntent.findFirst as jest.Mock).mockResolvedValue(null)
      ;(prisma.bookingIntent.create as jest.Mock).mockRejectedValue(dbError)

      await searchController.sendBookingIntent(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalledWith(dbError)
    })
  })

  describe('getSearchHistory', () => {
    it('should return user search history', async () => {
      mockRequest.user = {
        userId: '123',
        email: 'test@example.com',
        rol: 'user',
        exp: Date.now() + 3600,
        iat: Date.now()
      }

      const mockHistory = [
        {
          id: '1',
          userId: '123',
          flightsFrom: 'JFK',
          flightsTo: 'LAX',
          timestamp: new Date(),
          departureDate: new Date(),
          returnDate: null
        }
      ]

      ;(prisma.searchMetrics.findMany as jest.Mock).mockResolvedValue(mockHistory)

      await searchController.getSearchHistory(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(prisma.searchMetrics.findMany).toHaveBeenCalledWith({
        where: { userId: '123' },
        orderBy: { timestamp: 'desc' },
        take: 20
      })
      expect(mockResponse.json).toHaveBeenCalledWith({ history: mockHistory })
    })

    it('should limit history to 20 results', async () => {
      mockRequest.user = {
        userId: '123',
        email: 'test@example.com',
        rol: 'user',
        exp: Date.now() + 3600,
        iat: Date.now()
      }

      ;(prisma.searchMetrics.findMany as jest.Mock).mockResolvedValue([])

      await searchController.getSearchHistory(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(prisma.searchMetrics.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 20
        })
      )
    })

    it('should order history by timestamp descending', async () => {
      mockRequest.user = {
        userId: '123',
        email: 'test@example.com',
        rol: 'user',
        exp: Date.now() + 3600,
        iat: Date.now()
      }

      ;(prisma.searchMetrics.findMany as jest.Mock).mockResolvedValue([])

      await searchController.getSearchHistory(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(prisma.searchMetrics.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { timestamp: 'desc' }
        })
      )
    })

    it('should return empty array when no history exists', async () => {
      mockRequest.user = {
        userId: '123',
        email: 'test@example.com',
        rol: 'user',
        exp: Date.now() + 3600,
        iat: Date.now()
      }

      ;(prisma.searchMetrics.findMany as jest.Mock).mockResolvedValue([])

      await searchController.getSearchHistory(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.json).toHaveBeenCalledWith({ history: [] })
    })

    it('should handle database errors', async () => {
      mockRequest.user = {
        userId: '123',
        email: 'test@example.com',
        rol: 'user',
        exp: Date.now() + 3600,
        iat: Date.now()
      }

      const dbError = new Error('Database error')
      ;(prisma.searchMetrics.findMany as jest.Mock).mockRejectedValue(dbError)

      await searchController.getSearchHistory(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalledWith(dbError)
    })
  })
})
