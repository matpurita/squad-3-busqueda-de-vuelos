import { Router } from 'express'
import authController from '../controllers/auth'
import authMock from '../controllers/authMock'
import { authMiddleware } from '../middlewares/auth'

const router = Router()

router.post('/login', authController.login)
router.post('/login/mock', authMock.loginMock) // Ruta mock independiente
router.get('/user', authMiddleware, authController.getUserData)

export default router