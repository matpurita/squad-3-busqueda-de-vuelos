import request from 'supertest'
import express from 'express'
import searchRouter from './search'
import searchController from '../controllers/search'
import { requireAuth } from '../middlewares/auth'

jest.mock('../controllers/search')
jest.mock('../middlewares/auth', () => ({
  requireAuth: jest.fn((_req, _res, next) => next())
}))

const app = express()
app.use(express.json())
app.use('/search', searchRouter)

describe('search routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /', () => {
    it('should call searchFlights controller', async () => {
      ;(searchController.searchFlights as jest.Mock).mockImplementation((_req, res) => {
        res.json({ results: [], pagination: { total: 0, limit: 10, offset: 0 } })
      })

      const response = await request(app)
        .get('/search')
        .query({
          origin: 'JFK',
          destination: 'LAX',
          departureDate: '2025-12-01'
        })

      expect(response.status).toBe(200)
      expect(searchController.searchFlights).toHaveBeenCalled()
    })

    it('should pass query parameters to controller', async () => {
      ;(searchController.searchFlights as jest.Mock).mockImplementation((req, res) => {
        res.json({ results: [] })
      })

      await request(app)
        .get('/search')
        .query({
          origin: 'JFK',
          destination: 'LAX',
          departureDate: '2025-12-01',
          passengers: '2'
        })

      const mockCall = (searchController.searchFlights as jest.Mock).mock.calls[0]
      expect(mockCall[0].query).toMatchObject({
        origin: 'JFK',
        destination: 'LAX',
        departureDate: '2025-12-01',
        passengers: '2'
      })
    })
  })

  describe('GET /suggestions', () => {
    it('should call getFlightSuggestions controller', async () => {
      ;(searchController.getFlightSuggestions as jest.Mock).mockImplementation((req, res) => {
        res.json({ suggestions: [] })
      })

      const response = await request(app)
        .get('/search/suggestions')
        .query({ q: 'JFK' })

      expect(response.status).toBe(200)
      expect(searchController.getFlightSuggestions).toHaveBeenCalled()
    })

    it('should pass query parameter to controller', async () => {
      ;(searchController.getFlightSuggestions as jest.Mock).mockImplementation((req, res) => {
        res.json({ suggestions: [] })
      })

      await request(app)
        .get('/search/suggestions')
        .query({ q: 'New York' })

      const mockCall = (searchController.getFlightSuggestions as jest.Mock).mock.calls[0]
      expect(mockCall[0].query.q).toBe('New York')
    })
  })

  describe('POST /intent', () => {
    it('should call sendBookingIntent controller with auth', async () => {
      ;(searchController.sendBookingIntent as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json({ message: 'Booking recorded successfully' })
      })

      const response = await request(app)
        .post('/search/intent')
        .send({
          userId: '123',
          flightId: 'flight-1'
        })

      expect(response.status).toBe(201)
      expect(requireAuth).toHaveBeenCalled()
      expect(searchController.sendBookingIntent).toHaveBeenCalled()
    })

    it('should pass request body to controller', async () => {
      ;(searchController.sendBookingIntent as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json({ message: 'Booking recorded successfully' })
      })

      const bookingData = {
        userId: '123',
        flightId: 'flight-1',
        addedAt: '2025-12-01T10:00:00Z'
      }

      await request(app)
        .post('/search/intent')
        .send(bookingData)

      const mockCall = (searchController.sendBookingIntent as jest.Mock).mock.calls[0]
      expect(mockCall[0].body).toMatchObject(bookingData)
    })
  })

  describe('GET /history', () => {
    it('should call getSearchHistory controller with auth', async () => {
      ;(searchController.getSearchHistory as jest.Mock).mockImplementation((req, res) => {
        res.json({ history: [] })
      })

      const response = await request(app).get('/search/history')

      expect(response.status).toBe(200)
      expect(requireAuth).toHaveBeenCalled()
      expect(searchController.getSearchHistory).toHaveBeenCalled()
    })

    it('should return history data', async () => {
      const mockHistory = [
        {
          id: '1',
          userId: '123',
          flightsFrom: 'JFK',
          flightsTo: 'LAX',
          timestamp: new Date().toISOString()
        }
      ]

      ;(searchController.getSearchHistory as jest.Mock).mockImplementation((req, res) => {
        res.json({ history: mockHistory })
      })

      const response = await request(app).get('/search/history')

      expect(response.body).toEqual({ history: mockHistory })
    })
  })
})
