import express from 'express'
import searchRouter from './routes/search'
import statusRouter from './routes/status'
import eventsRouter from './routes/events'

const app = express()

app.use(express.json())

app.use('/search', searchRouter)
app.use('/status', statusRouter)
app.use('/events', eventsRouter)

export default app