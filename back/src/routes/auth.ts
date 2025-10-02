import { Router } from 'express'
import authController from '../controllers/auth'

const router = Router()

router.get('/user', authController.getUserData)

export default router