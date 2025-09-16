import { Router } from 'express'
import eventController from '../controllers/events'

const router = Router()

router.post('/', eventController.handleEvent)

export default router