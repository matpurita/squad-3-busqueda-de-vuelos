import app from './app'
import dotenv from 'dotenv'

dotenv.config()

const env = process.env.NODE_ENV || 'development'
const config = {
  port: process.env.PORT || 3000,
  env: env
}

app.listen(config, () => {
  console.log(`Server running on port ${config.port}`)
})
