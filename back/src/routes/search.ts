import { Router } from 'express'
import searchController from '../controllers/search'
import { authMiddleware } from '../middlewares/auth'

const router = Router()

router.get('/', searchController.searchFlights)
router.get('/suggestions', searchController.getFlightSuggestions)
router.post('/intent', authMiddleware, searchController.sendBookingIntent)

export default router
