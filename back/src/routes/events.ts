import { Router } from 'express'

const router = Router()

// Ruta de ejemplo para obtener vuelos
router.post('/', (req, res) => {
  res.send('Post events route')
})

export default router