import { Router } from 'express'
import airportController from '../controllers/airport'

const router = Router()

router.get('/', airportController.getAllAirports)
router.get('/AITA', airportController.getAllAITA)

export default router