import express from 'express'
import searchRouter from './routes/search'
import airportRouter from './routes/airport'
import eventsRouter from './routes/events'
import { errorHandler } from './middlewares/error'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/search', searchRouter)

app.use('/airport', airportRouter)

app.use('/events', eventsRouter)

app.use(errorHandler)

export default app