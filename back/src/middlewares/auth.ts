import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthPayloadSchema } from '../schemas/authPayload'

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next()
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, SECRET_KEY)

    const authPayload = AuthPayloadSchema.parse(decoded)

    if (authPayload.exp && Date.now() >= authPayload.exp * 1000) {
      return res.status(401).json({ message: 'Token expired' })
    }

    req.user = authPayload
    next()
  } catch (err) {
    console.error('JWT verification error:', err)
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  next()
}
