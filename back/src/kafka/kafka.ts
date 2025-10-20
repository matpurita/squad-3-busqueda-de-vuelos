import { Kafka, logLevel } from 'kafkajs'
import { prisma } from '../prisma/db'
import {
  AircraftOrAirlineUpdatedEvent,
  FlightCreatedEvent,
  FlightUpdatedEvent,
  ReservationCreatedEvent,
  ReservationUpdatedEvent
} from './events'

const EVENTS = {
  FLIGHT_CREATED: 'flights.flight.created',
  FLIGHT_UPDATED: 'flights.flight.updated',
  RESERVATION_CREATED: 'reservations.reservation.created',
  RESERVATION_UPDATED: 'reservations.reservation.updated',
  AIRCRAFT_OR_AIRLINE_UPDATED: 'flights.aircraft_or_airline.updated'
}

const kafka = new Kafka({ clientId: 'search-node', brokers: [process.env.KAFKA_BROKER || ''], logLevel: logLevel.INFO })
const consumer = kafka.consumer({ groupId: 'search-node-group' })

const connectConsumer = async () => {
  await consumer.connect()
  await consumer.subscribe({ topics: ['flights.events', 'reservations.events'], fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      console.log(`[${topic}] ${message.key?.toString() || ''} -> ${message.value?.toString()}`)

      const data = JSON.parse(message.value!.toString())

      switch (topic) {
        case EVENTS.FLIGHT_CREATED: {
          const content: FlightCreatedEvent = data

          await prisma.flight.create({
            data: {
              id: content.flightId,
              flightNumber: content.flightNumber,
              origin: {
                connect: { code: content.origin }
              },
              destination: {
                connect: { code: content.destination }
              },
              plane: {
                connect: { model: content.aircraftModel }
              },
              airline: {
                connect: { code: content.flightNumber.slice(0, 2) }
              },
              departure: new Date(content.departureAt),
              arrival: new Date(content.arrivalAt),
              status: content.status,
              price: content.price,
              currency: content.currency
            }
          })

          break
        }
        case EVENTS.FLIGHT_UPDATED: {
          const content: FlightUpdatedEvent = data

          await prisma.flight.update({
            where: { id: content.flightId },
            data: {
              status: content.newStatus,
              departure: content.newDepartureAt ? new Date(content.newDepartureAt) : undefined,
              arrival: content.newArrivalAt ? new Date(content.newArrivalAt) : undefined
            }
          })

          break
        }
        case EVENTS.RESERVATION_CREATED: {
          const content: ReservationCreatedEvent = data

          await prisma.booking.create({
            data: {
              id: content.reservationId,
              userId: content.userId,
              flightId: content.flightId,
              bookingDate: new Date(content.reservedAt)
            }
          })

          break
        }
        case EVENTS.RESERVATION_UPDATED: {
          const content: ReservationUpdatedEvent = data

          await prisma.booking.update({
            where: { id: content.reservationId },
            data: {
              status: content.newStatus,
              bookingDate: content.reservationDate ? new Date(content.reservationDate) : undefined
            }
          })

          break
        }
        case EVENTS.AIRCRAFT_OR_AIRLINE_UPDATED: {
          const content: AircraftOrAirlineUpdatedEvent = data

          await prisma.plane.update({
            where: { id: content.aircraftId },
            data: { capacity: content.capacity }
          })

          break
        }

        default:
          console.log(`No handler for topic: ${topic}`)
      }
    }
  })
}

type EventType = 'search.search.performed' | 'search.cart.item.added'
type EventPayload<T extends EventType> = {
  'search.search.performed': SearchMetric
  'search.cart.item.added': BookingIntent
}[T]

const postEvent = async <T extends EventType>(type: T, payload: EventPayload<T>) => {
  const now = new Date().toISOString()
  const messageId = `msg-${Date.now()}`
  const correlationId = `corr-${Date.now()}`
  const idempotencyKey = `search-${Date.now()}`

  await fetch('http://34.172.179.60/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'microservices-api-key-2024-secure'
    },
    body: JSON.stringify({
      messageId,
      eventType: type,
      schemaVersion: '1.0',
      occurredAt: now,
      producer: 'search-service',
      correlationId,
      idempotencyKey,
      payload: JSON.stringify(payload)
    })
  })
}

export { connectConsumer, postEvent, EVENTS }
