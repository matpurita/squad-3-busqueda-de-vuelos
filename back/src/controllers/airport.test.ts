import { Request, Response } from 'express'
import airportController from './airport'
import { prisma } from '../prisma/db'

jest.mock('../prisma/db', () => ({
  prisma: {
    airport: {
      findMany: jest.fn()
    }
  }
}))

describe('airport controller', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    }
    jest.clearAllMocks()
  })

  describe('getAllAirports', () => {
    it('should return all airports', async () => {
      const mockAirports = [
        {
          id: '1',
          code: 'JFK',
          name: 'John F. Kennedy International Airport',
          city: 'New York',
          country: 'USA'
        },
        {
          id: '2',
          code: 'LAX',
          name: 'Los Angeles International Airport',
          city: 'Los Angeles',
          country: 'USA'
        },
        {
          id: '3',
          code: 'ORD',
          name: 'O\'Hare International Airport',
          city: 'Chicago',
          country: 'USA'
        }
      ]

      ;(prisma.airport.findMany as jest.Mock).mockResolvedValue(mockAirports)

      await airportController.getAllAirports(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(prisma.airport.findMany).toHaveBeenCalledTimes(1)
      expect(prisma.airport.findMany).toHaveBeenCalledWith()
      expect(mockResponse.json).toHaveBeenCalledWith(mockAirports)
    })

    it('should return empty array when no airports exist', async () => {
      ;(prisma.airport.findMany as jest.Mock).mockResolvedValue([])

      await airportController.getAllAirports(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(prisma.airport.findMany).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledWith([])
    })

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed')
      ;(prisma.airport.findMany as jest.Mock).mockRejectedValue(dbError)

      await expect(
        airportController.getAllAirports(
          mockRequest as Request,
          mockResponse as Response
        )
      ).rejects.toThrow('Database connection failed')

      expect(prisma.airport.findMany).toHaveBeenCalledTimes(1)
    })

    it('should return airports with correct structure', async () => {
      const mockAirport = {
        id: '1',
        code: 'CDG',
        name: 'Charles de Gaulle Airport',
        city: 'Paris',
        country: 'France'
      }

      ;(prisma.airport.findMany as jest.Mock).mockResolvedValue([mockAirport])

      await airportController.getAllAirports(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockResponse.json).toHaveBeenCalledWith([
        expect.objectContaining({
          id: expect.any(String),
          code: expect.any(String),
          name: expect.any(String),
          city: expect.any(String),
          country: expect.any(String)
        })
      ])
    })
  })

  describe('getAllAITA', () => {
    it('should return list of AITA codes', async () => {
      const mockAirports = [
        { code: 'JFK' },
        { code: 'LAX' },
        { code: 'ORD' }
      ]

      ;(prisma.airport.findMany as jest.Mock).mockResolvedValue(mockAirports)

      await airportController.getAllAITA(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(prisma.airport.findMany).toHaveBeenCalledTimes(1)
      expect(prisma.airport.findMany).toHaveBeenCalledWith({
        select: {
          code: true
        }
      })
      expect(mockResponse.json).toHaveBeenCalledWith(['JFK', 'LAX', 'ORD'])
    })

    it('should return empty array when no airports exist', async () => {
      ;(prisma.airport.findMany as jest.Mock).mockResolvedValue([])

      await airportController.getAllAITA(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockResponse.json).toHaveBeenCalledWith([])
    })

    it('should map airport objects to code strings', async () => {
      const mockAirports = [
        { code: 'LHR' },
        { code: 'CDG' },
        { code: 'FRA' },
        { code: 'AMS' }
      ]

      ;(prisma.airport.findMany as jest.Mock).mockResolvedValue(mockAirports)

      await airportController.getAllAITA(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockResponse.json).toHaveBeenCalledWith(['LHR', 'CDG', 'FRA', 'AMS'])
    })

    it('should handle database errors', async () => {
      const dbError = new Error('Database query failed')
      ;(prisma.airport.findMany as jest.Mock).mockRejectedValue(dbError)

      await expect(
        airportController.getAllAITA(
          mockRequest as Request,
          mockResponse as Response
        )
      ).rejects.toThrow('Database query failed')

      expect(prisma.airport.findMany).toHaveBeenCalledTimes(1)
    })

    it('should only select code field', async () => {
      ;(prisma.airport.findMany as jest.Mock).mockResolvedValue([])

      await airportController.getAllAITA(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(prisma.airport.findMany).toHaveBeenCalledWith({
        select: {
          code: true
        }
      })
    })

    it('should handle single airport', async () => {
      const mockAirports = [{ code: 'SYD' }]

      ;(prisma.airport.findMany as jest.Mock).mockResolvedValue(mockAirports)

      await airportController.getAllAITA(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockResponse.json).toHaveBeenCalledWith(['SYD'])
    })

    it('should preserve code order from database', async () => {
      const mockAirports = [
        { code: 'ZZZ' },
        { code: 'AAA' },
        { code: 'MMM' }
      ]

      ;(prisma.airport.findMany as jest.Mock).mockResolvedValue(mockAirports)

      await airportController.getAllAITA(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockResponse.json).toHaveBeenCalledWith(['ZZZ', 'AAA', 'MMM'])
    })
  })
})
