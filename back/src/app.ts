import express from 'express'
import searchRouter from './routes/search'
import airportRouter from './routes/airport'
import authRouter from './routes/auth'
import { errorHandler } from './middlewares/error'
import cors from 'cors'
import { authMiddleware } from './middlewares/auth'

const app = express()

app.use(cors())
app.use(express.json())

app.use(authMiddleware)

app.use('/auth', authRouter)

app.use('/search', searchRouter)

app.use('/airport', airportRouter)

app.use(errorHandler)

export default app