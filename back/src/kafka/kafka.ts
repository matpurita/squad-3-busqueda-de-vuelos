import { Kafka } from 'kafkajs'
import { prisma } from '../prisma/db'

const EVENTS = {
  FLIGHT_CREATED: 'flights.flight.created',
  FLIGHT_UPDATED: 'flights.flight.updated',
  RESERVATION_CREATED: 'reservations.reservation.created',
  RESERVATION_UPDATED: 'reservations.reservation.updated',
  AIRLINE_OR_FLIGHT_UPDATED: 'flights.aircraft_or_airline.updated'
}

const kafka = new Kafka({ clientId: 'search-node', brokers: [process.env.KAFKA_BROKER || ''] })
const consumer = kafka.consumer({ groupId: 'search-node-group' })

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
        case EVENTS.RESERVATION_CREATED:
          console.log(`Sending booking confirmation email with data: ${content}`)

          await prisma.booking.create({
            data: content
          })
          break
        case EVENTS.RESERVATION_UPDATED:
          console.log(`Handling reservation updated event with data: ${content}`)

          await prisma.booking.update({
            where: { id: content.id },
            data: content
          })
          break

        case EVENTS.AIRLINE_OR_FLIGHT_UPDATED:
          console.log(`Handling airline or flight updated event with data: ${content}`)
          // Update related flights

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
