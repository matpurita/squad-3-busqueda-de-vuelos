import { Request, Response, NextFunction } from 'express'
import { AppError, errorHandler } from './error'

describe('error middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    nextFunction = jest.fn()
    // Create a fresh spy before each test
    jest.restoreAllMocks()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('AppError class', () => {
    it('should create an AppError with correct properties', () => {
      const error = new AppError('Test error', 400)

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(AppError)
      expect(error.message).toBe('Test error')
      expect(error.statusCode).toBe(400)
      expect(error.status).toBe('fail')
    })

    it('should set status to "fail" for 4xx errors', () => {
      const error400 = new AppError('Bad Request', 400)
      const error404 = new AppError('Not Found', 404)
      const error422 = new AppError('Unprocessable Entity', 422)

      expect(error400.status).toBe('fail')
      expect(error404.status).toBe('fail')
      expect(error422.status).toBe('fail')
    })

    it('should set status to "error" for 5xx errors', () => {
      const error500 = new AppError('Internal Server Error', 500)
      const error502 = new AppError('Bad Gateway', 502)
      const error503 = new AppError('Service Unavailable', 503)

      expect(error500.status).toBe('error')
      expect(error502.status).toBe('error')
      expect(error503.status).toBe('error')
    })

    it('should set status to "error" for 3xx errors', () => {
      const error300 = new AppError('Multiple Choices', 300)

      expect(error300.status).toBe('error')
    })

    it('should capture stack trace', () => {
      const error = new AppError('Test error', 400)

      expect(error.stack).toBeDefined()
      expect(error.stack).toContain('error.test.ts')
    })
  })

  describe('errorHandler', () => {
    it('should handle AppError with correct status code and message', () => {
      const appError = new AppError('Custom error message', 404)

      errorHandler(
        appError,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Custom error message'
      })
    })

    it('should handle regular Error as 500 Internal Server Error', () => {
      const regularError = new Error('Something went wrong')

      errorHandler(
        regularError,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', regularError)
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Internal server error'
      })
    })

    it('should handle 400 Bad Request AppError', () => {
      const badRequestError = new AppError('Invalid input', 400)

      errorHandler(
        badRequestError,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Invalid input'
      })
    })

    it('should handle 401 Unauthorized AppError', () => {
      const unauthorizedError = new AppError('Unauthorized access', 401)

      errorHandler(
        unauthorizedError,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Unauthorized access'
      })
    })

    it('should handle 403 Forbidden AppError', () => {
      const forbiddenError = new AppError('Forbidden', 403)

      errorHandler(
        forbiddenError,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(403)
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Forbidden'
      })
    })

    it('should handle 500 Server Error AppError', () => {
      const serverError = new AppError('Database connection failed', 500)

      errorHandler(
        serverError,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Database connection failed'
      })
    })

    it('should log regular errors to console', () => {
      const error = new Error('Unexpected error')

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', error)
    })

    it('should not log AppErrors to console', () => {
      const appError = new AppError('Expected error', 400)

      errorHandler(
        appError,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('should handle TypeError as internal server error', () => {
      const typeError = new TypeError('Cannot read property of undefined')

      errorHandler(
        typeError,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Internal server error'
      })
    })

    it('should handle ReferenceError as internal server error', () => {
      const referenceError = new ReferenceError('Variable is not defined')

      errorHandler(
        referenceError,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Internal server error'
      })
    })
  })
})
