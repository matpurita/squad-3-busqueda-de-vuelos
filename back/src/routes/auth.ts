import { Router } from 'express'
import authController from '../controllers/auth'

const router = Router()

router.get('/user', authController.getUserData)
router.post('/login', authController.login)

export default router