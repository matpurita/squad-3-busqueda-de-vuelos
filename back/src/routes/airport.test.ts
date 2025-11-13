import request from 'supertest'
import express from 'express'
import airportRouter from './airport'
import airportController from '../controllers/airport'

jest.mock('../controllers/airport')

const app = express()
app.use(express.json())
app.use('/airport', airportRouter)

describe('airport routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /', () => {
    it('should call getAllAirports controller', async () => {
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
        }
      ]

      ;(airportController.getAllAirports as jest.Mock).mockImplementation((req, res) => {
        res.json(mockAirports)
      })

      const response = await request(app).get('/airport')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockAirports)
      expect(airportController.getAllAirports).toHaveBeenCalled()
    })

    it('should return empty array when no airports exist', async () => {
      ;(airportController.getAllAirports as jest.Mock).mockImplementation((req, res) => {
        res.json([])
      })

      const response = await request(app).get('/airport')

      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })
  })

  describe('GET /AITA', () => {
    it('should call getAllAITA controller', async () => {
      const mockCodes = ['JFK', 'LAX', 'ORD', 'DFW']

      ;(airportController.getAllAITA as jest.Mock).mockImplementation((req, res) => {
        res.json(mockCodes)
      })

      const response = await request(app).get('/airport/AITA')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockCodes)
      expect(airportController.getAllAITA).toHaveBeenCalled()
    })

    it('should return empty array when no airports exist', async () => {
      ;(airportController.getAllAITA as jest.Mock).mockImplementation((req, res) => {
        res.json([])
      })

      const response = await request(app).get('/airport/AITA')

      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })

    it('should return array of strings', async () => {
      const mockCodes = ['LHR', 'CDG', 'FRA']

      ;(airportController.getAllAITA as jest.Mock).mockImplementation((req, res) => {
        res.json(mockCodes)
      })

      const response = await request(app).get('/airport/AITA')

      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.every((code: unknown) => typeof code === 'string')).toBe(true)
    })
  })

  describe('route configuration', () => {
    it('should have correct route paths', async () => {
      ;(airportController.getAllAirports as jest.Mock).mockImplementation((req, res) => {
        res.json([])
      })
      ;(airportController.getAllAITA as jest.Mock).mockImplementation((req, res) => {
        res.json([])
      })

      await request(app).get('/airport')
      expect(airportController.getAllAirports).toHaveBeenCalled()

      await request(app).get('/airport/AITA')
      expect(airportController.getAllAITA).toHaveBeenCalled()
    })

    it('should use GET method for both routes', async () => {
      ;(airportController.getAllAirports as jest.Mock).mockImplementation((req, res) => {
        res.json([])
      })

      const postResponse = await request(app).post('/airport')
      expect(postResponse.status).toBe(404)

      const getResponse = await request(app).get('/airport')
      expect(getResponse.status).toBe(200)
    })
  })
})
