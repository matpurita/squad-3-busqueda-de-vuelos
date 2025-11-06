import { NextFunction, Request, Response } from 'express'
import { loginPayloadSchema } from '../schemas/loginPayload'
import { registerPayloadSchema } from '../schemas/registerPayload'

async function getUserData(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const response = await fetch(`${process.env.AUTH_SERVICE_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.headers.authorization?.split(' ')[1]}`
      }
    }).then((response) => response.json())

    if (!response.success) {
      console.error('Failed to fetch user data:', response)
      return res.status(401).json({ message: 'Failed to fetch user data' })
    }

    return res.json(response.data.user)
  } catch (error) {
    next(error)
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const loginPayload = loginPayloadSchema.parse({
      email: req.body.email,
      password: req.body.password
    })

    const response = await fetch(`${process.env.AUTH_SERVICE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginPayload)
    }).then((response) => response.json())

    if (!response.success) {
      console.error('Login failed:', response)
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    return res.json(response.data)
  } catch (error) {
    next(error)
  }
}

async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const registerPayload = registerPayloadSchema.parse({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      nacionalidad: req.body.nacionalidad
    })

    const response = await fetch(`${process.env.AUTH_SERVICE_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerPayload)
    }).then((response) => response.json())

    if (!response.success) {
      console.error('Registration failed:', response)
      return res.status(400).json({ message: 'Registration failed', errors: response.errors })
    }

    return res.status(201).json(response.data)
  }
  catch (error) {
    next(error)
  }
}

export default { getUserData, login, register }
