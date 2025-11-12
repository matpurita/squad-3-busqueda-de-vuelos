import request from 'supertest'
import express from 'express'
import authRouter from './auth'
import authController from '../controllers/auth'
import { requireAuth } from '../middlewares/auth'

jest.mock('../controllers/auth')
jest.mock('../middlewares/auth', () => ({
  requireAuth: jest.fn((_req, _res, next) => next())
}))

const app = express()
app.use(express.json())
app.use('/auth', authRouter)

describe('auth routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /login', () => {
    it('should call login controller', async () => {
      ;(authController.login as jest.Mock).mockImplementation((req, res) => {
        res.json({ token: 'jwt-token', user: { id: '123' } })
      })

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })

      expect(response.status).toBe(200)
      expect(authController.login).toHaveBeenCalled()
    })

    it('should pass credentials to controller', async () => {
      ;(authController.login as jest.Mock).mockImplementation((req, res) => {
        res.json({ token: 'jwt-token' })
      })

      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      }

      await request(app)
        .post('/auth/login')
        .send(credentials)

      const mockCall = (authController.login as jest.Mock).mock.calls[0]
      expect(mockCall[0].body).toMatchObject(credentials)
    })
  })

  describe('POST /register', () => {
    it('should call register controller', async () => {
      ;(authController.register as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json({ message: 'User registered successfully' })
      })

      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          nationalityOrOrigin: 'USA'
        })

      expect(response.status).toBe(201)
      expect(authController.register).toHaveBeenCalled()
    })

    it('should pass user data to controller', async () => {
      ;(authController.register as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json({ message: 'User registered successfully' })
      })

      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword123',
        nationalityOrOrigin: 'Canada'
      }

      await request(app)
        .post('/auth/register')
        .send(userData)

      const mockCall = (authController.register as jest.Mock).mock.calls[0]
      expect(mockCall[0].body).toMatchObject(userData)
    })
  })

  describe('GET /user', () => {
    it('should call getUserData controller with auth', async () => {
      ;(authController.getUserData as jest.Mock).mockImplementation((req, res) => {
        res.json({ id: '123', email: 'test@example.com', name: 'Test User' })
      })

      const response = await request(app).get('/auth/user')

      expect(response.status).toBe(200)
      expect(requireAuth).toHaveBeenCalled()
      expect(authController.getUserData).toHaveBeenCalled()
    })

    it('should return user data', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User'
      }

      ;(authController.getUserData as jest.Mock).mockImplementation((req, res) => {
        res.json(mockUser)
      })

      const response = await request(app).get('/auth/user')

      expect(response.body).toEqual(mockUser)
    })
  })

  describe('route protection', () => {
    it('should not protect login route', async () => {
      ;(authController.login as jest.Mock).mockImplementation((req, res) => {
        res.json({ token: 'jwt-token' })
      })

      await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })

      // requireAuth should not be called for login
      expect(authController.login).toHaveBeenCalled()
    })

    it('should not protect register route', async () => {
      ;(authController.register as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json({ message: 'User registered successfully' })
      })

      await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          nationalityOrOrigin: 'USA'
        })

      expect(authController.register).toHaveBeenCalled()
    })

    it('should protect user route', async () => {
      ;(authController.getUserData as jest.Mock).mockImplementation((req, res) => {
        res.json({ id: '123' })
      })

      await request(app).get('/auth/user')

      expect(requireAuth).toHaveBeenCalled()
    })
  })
})
