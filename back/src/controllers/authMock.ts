import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { loginPayloadSchema } from '../schemas/loginPayload'

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'

// Mock users para testing
const MOCK_USERS = [
  {
    userId: '1',
    email: 'admin@test.com',
    password: 'adminadmin123',
  },
  {
    userId: '2', 
    email: 'user@test.com',
    password: 'user123',
  },
  {
    userId: '3',
    email: 'test@example.com',
    password: 'test123',
  }
]

// Login mock independiente
async function loginMock(req: Request, res: Response, next: NextFunction) {
  try {
    const loginPayload = loginPayloadSchema.parse({
      email: req.body.email,
      password: req.body.password
    })

    // Buscar usuario mock
    const mockUser = MOCK_USERS.find(
      user => user.email === loginPayload.email && user.password === loginPayload.password
    )

    if (!mockUser) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generar JWT token
    const tokenPayload = {
      userId: mockUser.userId,
      email: mockUser.email,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 horas
    }

    const token = jwt.sign(tokenPayload, SECRET_KEY)

    return res.json({ 
      success: true,
      token
    })
  } catch (error) {
    next(error)
  }
}

// Función helper para validar credenciales mock (para usar en el controller principal)
function validateMockCredentials(email: string, password: string) {
  const mockUser = MOCK_USERS.find(
    user => user.email === email && user.password === password
  )

  if (!mockUser) {
    return null
  }

  // Generar JWT token
  const tokenPayload = {
    userId: mockUser.userId,
    email: mockUser.email,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 horas
  }

  const token = jwt.sign(tokenPayload, SECRET_KEY)

  return {
    success: true,
    token,
    user: {
      userId: mockUser.userId,
      email: mockUser.email,
    }
  }
}

// Función para obtener todos los usuarios mock (útil para testing)
function getMockUsers() {
  return MOCK_USERS.map(user => ({
    userId: user.userId,
    email: user.email
    // No devolvemos password por seguridad
  }))
}

export default { 
  loginMock, 
  validateMockCredentials, 
  getMockUsers 
}