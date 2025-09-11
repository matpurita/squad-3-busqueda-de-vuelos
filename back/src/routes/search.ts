import { Router } from 'express'
import searchController from '../controllers/search'

const router = Router()

router.get('/', searchController.searchFlights)

router.get('/suggestions', (req, res) => {
  res.send('Flight suggestions')
})

export default router
