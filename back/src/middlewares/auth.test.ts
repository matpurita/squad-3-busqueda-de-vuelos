import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { authMiddleware, requireAuth } from './auth'

describe('auth middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    mockRequest = {
      headers: {}
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    nextFunction = jest.fn()
    // Suppress console.error during tests since we're testing error scenarios
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('authMiddleware', () => {
    const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'

    it('should call next() when no authorization header is present', () => {
      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction)

      expect(nextFunction).toHaveBeenCalled()
      expect(mockRequest.user).toBeUndefined()
    })

    it('should call next() when authorization header does not start with Bearer', () => {
      mockRequest.headers = {
        authorization: 'Basic some-token'
      }

      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction)

      expect(nextFunction).toHaveBeenCalled()
      expect(mockRequest.user).toBeUndefined()
    })

    it('should set user on request when valid token is provided', () => {
      const payload = {
        userId: '123',
        email: 'test@example.com',
        rol: 'user',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000)
      }
      const token = jwt.sign(payload, SECRET_KEY)
      
      mockRequest.headers = {
        authorization: `Bearer ${token}`
      }

      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction)

      expect(mockRequest.user).toBeDefined()
      expect(mockRequest.user?.userId).toBe('123')
      expect(mockRequest.user?.email).toBe('test@example.com')
      expect(nextFunction).toHaveBeenCalled()
    })

    it('should return 401 when token is expired', () => {
      const payload = {
        userId: '123',
        email: 'test@example.com',
        rol: 'user',
        exp: Math.floor(Date.now() / 1000) - 3600, // expired 1 hour ago
        iat: Math.floor(Date.now() / 1000) - 7200
      }
      const token = jwt.sign(payload, SECRET_KEY)
      
      mockRequest.headers = {
        authorization: `Bearer ${token}`
      }

      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction)

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid token' })
    })

    it('should return 401 when token is invalid', () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token'
      }

      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction)

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid token' })
    })

    it('should return 401 when token is signed with wrong secret', () => {
      const payload = {
        userId: '123',
        email: 'test@example.com',
        rol: 'user',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000)
      }
      const token = jwt.sign(payload, 'wrong-secret')
      
      mockRequest.headers = {
        authorization: `Bearer ${token}`
      }

      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction)

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid token' })
    })

    it('should handle malformed JWT payloads', () => {
      const payload = {
        // Missing required fields
        userId: '123'
      }
      const token = jwt.sign(payload, SECRET_KEY)
      
      mockRequest.headers = {
        authorization: `Bearer ${token}`
      }

      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction)

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid token' })
    })
  })

  describe('requireAuth', () => {
    it('should call next() when user is present', () => {
      mockRequest.user = {
        userId: '123',
        email: 'test@example.com',
        rol: 'user',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000)
      }

      requireAuth(mockRequest as Request, mockResponse as Response, nextFunction)

      expect(nextFunction).toHaveBeenCalled()
      expect(mockResponse.status).not.toHaveBeenCalled()
    })

    it('should return 401 when user is not present', () => {
      requireAuth(mockRequest as Request, mockResponse as Response, nextFunction)

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' })
      expect(nextFunction).not.toHaveBeenCalled()
    })

    it('should return 401 when user is null', () => {
      mockRequest.user = null as unknown as undefined

      requireAuth(mockRequest as Request, mockResponse as Response, nextFunction)

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' })
    })

    it('should return 401 when user is undefined', () => {
      mockRequest.user = undefined

      requireAuth(mockRequest as Request, mockResponse as Response, nextFunction)

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' })
    })
  })
})
