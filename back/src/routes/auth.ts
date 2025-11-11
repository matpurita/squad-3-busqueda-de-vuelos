import { Router } from 'express'
import authController from '../controllers/auth'
import { requireAuth } from '../middlewares/auth'

const router = Router()

router.post('/login', authController.login)
router.post('/register', authController.register)
router.get('/user', requireAuth, authController.getUserData)

export default router