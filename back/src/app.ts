import express from 'express'
import searchRouter from './routes/search'
import airportRouter from './routes/airport'
import authRouter from './routes/auth'
import metricsRouter from './routes/metrics'
import { errorHandler } from './middlewares/error'
import { authMiddleware } from './middlewares/auth'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRouter)

app.use('/search', authMiddleware, searchRouter)

app.use('/airport', authMiddleware, airportRouter)

app.use('/metrics', authMiddleware, metricsRouter)

app.use(errorHandler)

// connectConsumer().then(() => {
//   console.log('Kafka consumer connected and running')
// }).catch(err => {
//   console.error('Error connecting Kafka consumer:', err)
// })

export default app