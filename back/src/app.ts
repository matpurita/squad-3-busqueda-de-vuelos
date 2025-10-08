import express from 'express'
import searchRouter from './routes/search'
import airportRouter from './routes/airport'
import eventsRouter from './routes/events'
import authRouter from './routes/auth'
import metricsRouter from './routes/metrics'
import { errorHandler } from './middlewares/error'
import { authMiddleware } from './middlewares/auth'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRouter)

app.use('/search', searchRouter, authMiddleware)

app.use('/airport', airportRouter, authMiddleware)

app.use('/events', eventsRouter, authMiddleware)

app.use('/metrics', metricsRouter, authMiddleware)

app.use(errorHandler)

export default app