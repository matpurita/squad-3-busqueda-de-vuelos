import app from './app'
import dotenv from 'dotenv'
import { connectConsumer } from './kafka/kafka'

dotenv.config()

const env = process.env.NODE_ENV || 'development'
const config = {
  port: process.env.PORT || 3000,
  env: env
}

app.listen(config, () => {
  console.log(`Server running on port ${config.port}`)
  
  connectConsumer()
    .then(() => {
      console.log('Kafka consumer connected and running')
    })
    .catch((err) => {
      console.error('Error connecting Kafka consumer:', err)
    })
})
