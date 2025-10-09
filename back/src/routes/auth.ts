import { Router } from 'express'
import authController from '../controllers/auth'
import { authMiddleware } from '../middlewares/auth'

const router = Router()

router.post('/login', authController.login)
router.get('/user', authMiddleware, authController.getUserData)

export default router