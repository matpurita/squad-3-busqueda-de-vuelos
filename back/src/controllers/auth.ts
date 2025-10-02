import { NextFunction, Request, Response } from 'express'

async function getUserData(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
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

export default { getUserData }
