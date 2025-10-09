import { Kafka } from 'kafkajs'
import { prisma } from '../prisma/db'

const EVENTS = {
  FLIGHT_CREATED: 'flight_created',
  FLIGHT_UPDATED: 'flight_updated',
  FLIGHT_DELETED: 'flight_deleted',
  FLIGHT_BOOKED: 'flight_booked'
}

const kafka = new Kafka({ clientId: 'search-service', brokers: [process.env.KAFKA_BROKER || ''] })
const consumer = kafka.consumer({ groupId: 'search-group' })

const connectConsumer = async () => {
  await consumer.connect()
  await consumer.subscribe({ topics: Object.values(EVENTS) })

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const content = JSON.parse(message.value!.toString())

      switch (topic) {
        case EVENTS.FLIGHT_CREATED:
          console.log(`Handling flight created event with data: ${content}`)

          await prisma.flight.create({
            data: content
          })
          break
        case EVENTS.FLIGHT_UPDATED:
          console.log(`Handling flight updated event with data: ${content}`)

          await prisma.flight.update({
            where: { id: content.id },
            data: content
          })
          break
        case EVENTS.FLIGHT_DELETED:
          console.log(`Handling flight deleted event with data: ${content}`)

          await prisma.flight.delete({
            where: { id: content.id }
          })
          break
        case EVENTS.FLIGHT_BOOKED:
          console.log(`Sending booking confirmation email with data: ${content}`)

          await prisma.booking.create({
            data: content
          })
          break
        default:
          console.log(`No handler for topic: ${topic}`)
      }
    }
  })
}

const getProducer = async () => {
  const producer = kafka.producer()
  await producer.connect()
  return producer
}

export { connectConsumer, getProducer, EVENTS }
