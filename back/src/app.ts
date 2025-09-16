import express from 'express'
import searchRouter from './routes/search'
import eventsRouter from './routes/events'
import { errorHandler } from './middlewares/error'

const app = express()

app.use(express.json())

app.use('/search', searchRouter)
app.use('/events', eventsRouter)

app.use(errorHandler)

export default app