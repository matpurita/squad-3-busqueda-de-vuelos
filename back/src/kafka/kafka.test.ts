import { EVENTS, postEvent } from './kafka'

global.fetch = jest.fn()

describe('kafka module', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('EVENTS constants', () => {
    it('should have correct event names', () => {
      expect(EVENTS.FLIGHT_CREATED).toBe('flights.flight.created')
      expect(EVENTS.FLIGHT_UPDATED).toBe('flights.flight.updated')
      expect(EVENTS.RESERVATION_CREATED).toBe('reservations.reservation.created')
      expect(EVENTS.RESERVATION_UPDATED).toBe('reservations.reservation.updated')
    })

    it('should be readonly', () => {
      // EVENTS object should be immutable (const with as const assertion)
      expect(EVENTS.FLIGHT_CREATED).toBe('flights.flight.created')
      expect(Object.isFrozen(EVENTS)).toBe(false) // JavaScript const doesn't freeze objects
    })
  })

  describe('postEvent', () => {
    beforeEach(() => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true })
      })
    })

    it('should post search performed event', async () => {
      const searchMetric = {
        userId: '123',
        flightsFrom: 'JFK',
        flightsTo: 'LAX',
        departureDate: '2025-12-01',
        returnDate: '2025-12-05',
        resultsCount: 10,
        timestamp: new Date()
      }

      await postEvent('search.search.performed', searchMetric)

      expect(global.fetch).toHaveBeenCalledWith(
        process.env.CORE_URL + '/events',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'microservices-api-key-2024-secure'
          },
          body: expect.any(String)
        })
      )
    })

    it('should post cart item added event', async () => {
      const bookingIntent = {
        userId: '123',
        flightId: 'flight-1',
        addedAt: new Date()
      }

      await postEvent('search.cart.item.added', bookingIntent)

      expect(global.fetch).toHaveBeenCalledTimes(1)
      
      const callArgs = (global.fetch as jest.Mock).mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      
      expect(body.eventType).toBe('search.cart.item.added')
      expect(body.producer).toBe('search-service')
    })

    it('should post user created event', async () => {
      const userEvent = {
        userId: '123',
        nombre_completo: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        nationalityOrOrigin: 'USA',
        roles: ['usuario'],
        createdAt: new Date().toISOString()
      }

      await postEvent('users.user.created', userEvent)

      expect(global.fetch).toHaveBeenCalledWith(
        process.env.CORE_URL + '/events',
        expect.objectContaining({
          method: 'POST'
        })
      )
    })

    it('should include messageId in event', async () => {
      const searchMetric = {
        userId: '123',
        flightsFrom: 'JFK',
        flightsTo: 'LAX',
        departureDate: '2025-12-01',
        resultsCount: 5,
        timestamp: new Date()
      }

      await postEvent('search.search.performed', searchMetric)

      const callArgs = (global.fetch as jest.Mock).mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      
      expect(body.messageId).toMatch(/^msg-\d+$/)
    })

    it('should include correlationId in event', async () => {
      const searchMetric = {
        userId: '123',
        flightsFrom: 'JFK',
        flightsTo: 'LAX',
        departureDate: '2025-12-01',
        resultsCount: 5,
        timestamp: new Date()
      }

      await postEvent('search.search.performed', searchMetric)

      const callArgs = (global.fetch as jest.Mock).mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      
      expect(body.correlationId).toMatch(/^corr-\d+$/)
    })

    it('should include idempotencyKey in event', async () => {
      const searchMetric = {
        userId: '123',
        flightsFrom: 'JFK',
        flightsTo: 'LAX',
        departureDate: '2025-12-01',
        resultsCount: 5,
        timestamp: new Date()
      }

      await postEvent('search.search.performed', searchMetric)

      const callArgs = (global.fetch as jest.Mock).mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      
      expect(body.idempotencyKey).toMatch(/^search-\d+$/)
    })

    it('should include schemaVersion', async () => {
      const searchMetric = {
        userId: '123',
        flightsFrom: 'JFK',
        flightsTo: 'LAX',
        departureDate: '2025-12-01',
        resultsCount: 5,
        timestamp: new Date()
      }

      await postEvent('search.search.performed', searchMetric)

      const callArgs = (global.fetch as jest.Mock).mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      
      expect(body.schemaVersion).toBe('1.0')
    })

    it('should include occurredAt timestamp', async () => {
      const beforeTime = new Date().toISOString()
      
      const searchMetric = {
        userId: '123',
        flightsFrom: 'JFK',
        flightsTo: 'LAX',
        departureDate: '2025-12-01',
        resultsCount: 5,
        timestamp: new Date()
      }

      await postEvent('search.search.performed', searchMetric)

      const afterTime = new Date().toISOString()
      const callArgs = (global.fetch as jest.Mock).mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      
      expect(body.occurredAt).toBeDefined()
      expect(body.occurredAt >= beforeTime && body.occurredAt <= afterTime).toBe(true)
    })

    it('should set producer as search-service', async () => {
      const searchMetric = {
        userId: '123',
        flightsFrom: 'JFK',
        flightsTo: 'LAX',
        departureDate: '2025-12-01',
        resultsCount: 5,
        timestamp: new Date()
      }

      await postEvent('search.search.performed', searchMetric)

      const callArgs = (global.fetch as jest.Mock).mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      
      expect(body.producer).toBe('search-service')
    })

    it('should stringify payload', async () => {
      const searchMetric = {
        userId: '123',
        flightsFrom: 'JFK',
        flightsTo: 'LAX',
        departureDate: '2025-12-01',
        resultsCount: 5,
        timestamp: new Date()
      }

      await postEvent('search.search.performed', searchMetric)

      const callArgs = (global.fetch as jest.Mock).mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      
      expect(typeof body.payload).toBe('string')
      expect(() => JSON.parse(body.payload)).not.toThrow()
    })

    it('should include API key in headers', async () => {
      const searchMetric = {
        userId: '123',
        flightsFrom: 'JFK',
        flightsTo: 'LAX',
        departureDate: '2025-12-01',
        resultsCount: 5,
        timestamp: new Date()
      }

      await postEvent('search.search.performed', searchMetric)

      const callArgs = (global.fetch as jest.Mock).mock.calls[0]
      
      expect(callArgs[1].headers['X-API-Key']).toBe('microservices-api-key-2024-secure')
    })

    it('should handle fetch errors gracefully', async () => {
      const error = new Error('Network error')
      ;(global.fetch as jest.Mock).mockRejectedValue(error)

      const searchMetric = {
        userId: '123',
        flightsFrom: 'JFK',
        flightsTo: 'LAX',
        departureDate: '2025-12-01',
        resultsCount: 5,
        timestamp: new Date()
      }

      await expect(postEvent('search.search.performed', searchMetric)).rejects.toThrow('Network error')
    })

    it('should use CORE_URL from environment', async () => {      
      const searchMetric = {
        userId: '123',
        flightsFrom: 'JFK',
        flightsTo: 'LAX',
        departureDate: '2025-12-01',
        resultsCount: 5,
        timestamp: new Date()
      }

      await postEvent('search.search.performed', searchMetric)

      expect(global.fetch).toHaveBeenCalledWith(
        process.env.CORE_URL + '/events',
        expect.any(Object)
      )
    })
  })
})
