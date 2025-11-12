import { Request, Response, NextFunction } from 'express'
import authController from './auth'
import { postEvent } from '../kafka/kafka'

// Mock dependencies
jest.mock('../kafka/kafka', () => ({
  postEvent: jest.fn()
}))

global.fetch = jest.fn()

describe('auth controller', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {
      body: {},
      headers: {},
      user: undefined
    }
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    }
    nextFunction = jest.fn()
    jest.clearAllMocks()
  })

  describe('getUserData', () => {
    it('should return 401 when user is not authenticated', async () => {
      await authController.getUserData(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' })
    })

    it('should fetch and return user data when authenticated', async () => {
      const mockUserData = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User'
      }

      mockRequest.user = {
        userId: '123',
        email: 'test@example.com',
        rol: 'user',
        exp: Date.now() + 3600,
        iat: Date.now()
      }
      mockRequest.headers = {
        authorization: 'Bearer valid-token'
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          data: { user: mockUserData }
        })
      })

      await authController.getUserData(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.AUTH_SERVICE_URL}/auth/me`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer valid-token'
          }
        }
      )
      expect(mockResponse.json).toHaveBeenCalledWith(mockUserData)
    })

    it('should return 401 when auth service returns failure', async () => {
      mockRequest.user = {
        userId: '123',
        email: 'test@example.com',
        rol: 'user',
        exp: Date.now() + 3600,
        iat: Date.now()
      }
      mockRequest.headers = {
        authorization: 'Bearer invalid-token'
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          success: false
        })
      })

      await authController.getUserData(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Failed to fetch user data' })
    })

    it('should call next with error when fetch fails', async () => {
      mockRequest.user = {
        userId: '123',
        email: 'test@example.com',
        rol: 'user',
        exp: Date.now() + 3600,
        iat: Date.now()
      }
      mockRequest.headers = {
        authorization: 'Bearer token'
      }

      const error = new Error('Network error')
      ;(global.fetch as jest.Mock).mockRejectedValue(error)

      await authController.getUserData(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalledWith(error)
    })
  })

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      }
      const responseData = {
        token: 'jwt-token',
        user: { id: '123', email: 'test@example.com' }
      }

      mockRequest.body = loginData

      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          data: responseData
        })
      })

      await authController.login(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.AUTH_SERVICE_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginData)
        }
      )
      expect(mockResponse.json).toHaveBeenCalledWith(responseData)
    })

    it('should return 401 with invalid credentials', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          success: false
        })
      })

      await authController.login(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid credentials' })
    })

    it('should call next with validation error for invalid email', async () => {
      mockRequest.body = {
        email: 'invalid-email',
        password: 'password123'
      }

      await authController.login(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalled()
      expect(nextFunction).toHaveBeenCalledWith(expect.any(Error))
    })

    it('should call next with validation error for short password', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'short'
      }

      await authController.login(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalled()
    })

    it('should handle network errors', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123'
      }

      const error = new Error('Network failure')
      ;(global.fetch as jest.Mock).mockRejectedValue(error)

      await authController.login(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalledWith(error)
    })
  })

  describe('register', () => {
    it('should successfully register a new user', async () => {
      mockRequest.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        nationalityOrOrigin: 'USA'
      }

      await authController.register(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(postEvent).toHaveBeenCalledWith('users.user.created', {
        email: 'test@example.com',
        password: 'password123',
        nationalityOrOrigin: 'USA',
        nombre_completo: 'Test User',
        roles: ['usuario'],
        createdAt: expect.any(String),
        userId: '1'
      })
      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User registered successfully'
      })
    })

    it('should call next with validation error for invalid email', async () => {
      mockRequest.body = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
        nationalityOrOrigin: 'USA'
      }

      await authController.register(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalled()
      expect(postEvent).not.toHaveBeenCalled()
    })

    it('should call next with validation error for short password', async () => {
      mockRequest.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'short',
        nationalityOrOrigin: 'USA'
      }

      await authController.register(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalled()
      expect(postEvent).not.toHaveBeenCalled()
    })

    it('should call next with validation error for short name', async () => {
      mockRequest.body = {
        name: 'T',
        email: 'test@example.com',
        password: 'password123',
        nationalityOrOrigin: 'USA'
      }

      await authController.register(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalled()
      expect(postEvent).not.toHaveBeenCalled()
    })

    it('should call next with validation error for missing nationalityOrOrigin', async () => {
      mockRequest.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }

      await authController.register(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalled()
      expect(postEvent).not.toHaveBeenCalled()
    })

    it('should handle postEvent errors', async () => {
      mockRequest.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        nationalityOrOrigin: 'USA'
      }

      const error = new Error('Kafka error')
      ;(postEvent as jest.Mock).mockRejectedValue(error)

      await authController.register(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalledWith(error)
    })

    it('should register user with complete data', async () => {
      mockRequest.body = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'securePassword123',
        nationalityOrOrigin: 'Canada'
      }

      await authController.register(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(postEvent).toHaveBeenCalledWith('users.user.created', {
        email: 'john.doe@example.com',
        password: 'securePassword123',
        nationalityOrOrigin: 'Canada',
        nombre_completo: 'John Doe',
        roles: ['usuario'],
        createdAt: expect.any(String),
        userId: '1'
      })
    })
  })
})
