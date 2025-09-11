import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.send('Status route')
})

export default router
