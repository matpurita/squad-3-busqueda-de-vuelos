import { Router } from 'express'
import metricsController from '../controllers/metrics'

const router = Router()

router.post('/search', metricsController.postSearchMetric)

export default router