import request from 'supertest'
import app from './app'
import { prisma } from './prisma/db'

jest.mock('./prisma/db', () => ({
  prisma: {
    airport: {
      findMany: jest.fn()
    },
    flight: {
      findMany: jest.fn()
    },
    searchMetrics: {
      create: jest.fn(),
      findMany: jest.fn()
    },
    bookingIntent: {
      create: jest.fn()
    }
  }
}))

jest.mock('./kafka/kafka', () => ({
  postEvent: jest.fn()
}))

jest.mock('./middlewares/auth', () => ({
  authMiddleware: jest.fn((_req, _res, next) => next()),
  requireAuth: jest.fn((req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    next()
  })
}))

// Set environment variable before importing controller
process.env.AUTH_SERVICE_URL = 'http://test-auth-service.com'
process.env.CORE_URL = 'http://test-core-service.com'

describe('app integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('middleware setup', () => {
    it('should accept JSON payloads', async () => {
      ;(prisma.airport.findMany as jest.Mock).mockResolvedValue([])

      const response = await request(app)
        .get('/airport')

      expect(response.status).toBe(200)
    })

    it('should handle CORS requests', async () => {
      ;(prisma.airport.findMany as jest.Mock).mockResolvedValue([])

      const response = await request(app)
        .get('/airport')
        .set('Origin', 'http://localhost:3000')

      expect(response.headers['access-control-allow-origin']).toBeDefined()
    })
  })

  describe('route mounting', () => {
    it('should mount auth routes at /auth', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })

      // Should reach the route even if it fails validation
      expect(response.status).not.toBe(404)
    })

    it('should mount search routes at /search', async () => {
      ;(prisma.flight.findMany as jest.Mock).mockResolvedValue([])

      const response = await request(app)
        .get('/search')
        .query({
          origin: 'JFK',
          destination: 'LAX',
          departureDate: '2025-12-01'
        })

      expect(response.status).not.toBe(404)
    })

    it('should mount airport routes at /airport', async () => {
      ;(prisma.airport.findMany as jest.Mock).mockResolvedValue([])

      const response = await request(app).get('/airport')

      expect(response.status).toBe(200)
    })
  })

  describe('error handling', () => {
    it('should handle 404 errors for unknown routes', async () => {
      const response = await request(app).get('/unknown-route')

      expect(response.status).toBe(404)
    })

    it('should handle validation errors', async () => {
      const response = await request(app)
        .get('/search')
        .query({
          origin: 'INVALID-CODE',
          destination: 'LAX',
          departureDate: '2025-12-01'
        })

      expect(response.status).toBe(400)
    })
  })

  describe('authentication flow', () => {
    it('should allow unauthenticated access to public routes', async () => {
      ;(prisma.flight.findMany as jest.Mock).mockResolvedValue([])

      const response = await request(app)
        .get('/search')
        .query({
          origin: 'JFK',
          destination: 'LAX',
          departureDate: '2025-12-01'
        })

      expect(response.status).toBe(200)
    })

    it('should allow access to airport list without auth', async () => {
      ;(prisma.airport.findMany as jest.Mock).mockResolvedValue([])

      const response = await request(app).get('/airport')

      expect(response.status).toBe(200)
    })

    it('should protect booking intent endpoint', async () => {
      const response = await request(app)
        .post('/search/intent')
        .send({
          userId: '123',
          flightId: 'flight-1'
        })

      expect(response.status).toBe(401)
    })

    it('should protect search history endpoint', async () => {
      const response = await request(app).get('/search/history')

      expect(response.status).toBe(401)
    })
  })

  describe('content type handling', () => {
    it('should handle JSON request bodies', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          nationalityOrOrigin: 'USA'
        })
        .set('Content-Type', 'application/json')

      expect(response.status).not.toBe(415)
    })

    it('should return JSON responses', async () => {
      ;(prisma.airport.findMany as jest.Mock).mockResolvedValue([])

      const response = await request(app).get('/airport')

      expect(response.headers['content-type']).toMatch(/json/)
    })
  })

  describe('query parameter parsing', () => {
    it('should parse search query parameters', async () => {
      ;(prisma.flight.findMany as jest.Mock).mockResolvedValue([])

      const response = await request(app)
        .get('/search')
        .query({
          origin: 'JFK',
          destination: 'LAX',
          departureDate: '2025-12-01',
          passengers: '2',
          sort: 'price_asc'
        })

      expect(response.status).toBe(200)
    })

    it('should parse suggestion query parameter', async () => {
      ;(prisma.flight.findMany as jest.Mock).mockResolvedValue([])

      const response = await request(app)
        .get('/search/suggestions')
        .query({ q: 'New York' })

      expect(response.status).toBe(200)
    })
  })

  describe('response structure', () => {
    it('should return consistent error response structure', async () => {
      const response = await request(app)
        .get('/search')
        .query({
          origin: 'AB', // Invalid - too short
          destination: 'LAX',
          departureDate: '2025-12-01'
        })

      expect(response.body).toHaveProperty('status')
      expect(response.body).toHaveProperty('message')
    })

    it('should return paginated search results', async () => {
      ;(prisma.flight.findMany as jest.Mock).mockResolvedValue([])

      const response = await request(app)
        .get('/search')
        .query({
          origin: 'JFK',
          destination: 'LAX',
          departureDate: '2025-12-01'
        })

      expect(response.body).toHaveProperty('results')
      expect(response.body).toHaveProperty('pagination')
      expect(response.body.pagination).toHaveProperty('total')
      expect(response.body.pagination).toHaveProperty('limit')
      expect(response.body.pagination).toHaveProperty('offset')
    })
  })
})
