import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.send('Flights route')
})

router.get('/suggestions', (req, res) => {
  res.send('Flight suggestions')
})

export default router
