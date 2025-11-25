import { NextFunction, Request, Response } from 'express'
import { loginPayloadSchema } from '../schemas/loginPayload'
import { registerPayloadSchema } from '../schemas/registerPayload'
import { postEvent } from '../kafka/kafka'
import { encryptPasswordAES128 } from '../utils/auth'

async function getUserData(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const response = await fetch(`${process.env.AUTH_SERVICE_URL}/auth/me`, {
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
      return res.status(401).json({ message: response.message || 'Invalid credentials' })
    }

    return res.json(response.data)
  } catch (error) {
    next(error)
  }
}

async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, password, ...registerPayload } = registerPayloadSchema.parse({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      nationalityOrOrigin: req.body.nationalityOrOrigin
    })

    await postEvent('users.user.created', {
      ...registerPayload,
      nombre_completo: name,
      password: encryptPasswordAES128(password),
      roles: ['usuario'],
      createdAt: new Date().toISOString(),
      userId: crypto.randomUUID()
    })
    
    // No guardar en la tabla de usuarios, se guardara al recibir el evento users.user.created en el microservicio de auth

    return res.status(201).json({ message: 'User registered successfully' })
  }
  catch (error) {
    next(error)
  }
}

export default { getUserData, login, register }
