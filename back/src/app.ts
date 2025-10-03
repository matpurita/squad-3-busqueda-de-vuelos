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
//app.use(authMiddleware)

app.use('/search', searchRouter)

app.use('/airport', airportRouter)

app.use('/events', eventsRouter)

app.use('/auth', authRouter)

app.use('/metrics', metricsRouter)

app.use(errorHandler)

export default app