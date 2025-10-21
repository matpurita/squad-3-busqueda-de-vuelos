import { Router } from 'express'
import searchController from '../controllers/search'
import { requireAuth } from '../middlewares/auth'

const router = Router()

router.get('/', searchController.searchFlights)
router.get('/suggestions', searchController.getFlightSuggestions)
router.post('/intent', requireAuth, searchController.sendBookingIntent)

export default router
