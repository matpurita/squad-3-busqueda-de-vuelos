import { Router } from 'express'
import searchController from '../controllers/search'

const router = Router()

router.get('/', searchController.searchFlights)
router.get('/suggestions', searchController.getFlightSuggestions)
router.post('/intent', searchController.sendBookingIntent)

export default router
