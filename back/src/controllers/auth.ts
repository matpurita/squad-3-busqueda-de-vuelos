import { NextFunction, Request, Response } from 'express'
import { loginPayloadSchema } from '../schemas/loginPayload'
import authMock from './authMock'

async function getUserData(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    console.log('Usuario autenticado:', req.user) // Log para testing
    res.json({
      user: {
        userId: req.user.userId,
        email: req.user.email
      }
    })
  } catch (error) {
    next(error)
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    console.log(req.body)
    const loginPayload = loginPayloadSchema.parse({
      email: req.body.email,
      password: req.body.password
    })

    // Si USE_MOCK_AUTH está habilitado, usar mock
    if (process.env.USE_MOCK_AUTH === 'true') {
      const mockResult = authMock.validateMockCredentials(
        loginPayload.email, 
        loginPayload.password
      )
      
      if (!mockResult) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }
      
      return res.json(mockResult)
    }

    const response = await fetch(`${process.env.AUTH_SERVICE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginPayload)
    }).then((response) => response.json())

    if (!response.success) {
      console.error('Login failed:', response)
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    return res.json({ token: response.data })
  } catch (error) {
    next(error)
  }
}

export default { getUserData, login }
