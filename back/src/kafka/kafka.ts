import { Kafka, logLevel } from 'kafkajs'
import { prisma } from '../prisma/db'
import {
  FlightCreatedEvent,
  FlightUpdatedEvent,
  ReservationCreatedEvent,
  ReservationUpdatedEvent,
  UserCreateEvent
} from './events'
import { SearchMetric } from '../schemas/searchMetric'
import { BookingIntent } from '../schemas/bookingIntent'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Prisma } from '@prisma/client'

const EVENTS = {
  FLIGHT_CREATED: 'flights.flight.created',
  FLIGHT_UPDATED: 'flights.flight.updated',
  RESERVATION_CREATED: 'reservations.reservation.created',
  RESERVATION_UPDATED: 'reservations.reservation.updated'
} as const

const kafka = new Kafka({
  clientId: 'search-node',
  brokers: [process.env.KAFKA_BROKER || ''],
  logLevel: logLevel.INFO
})
const consumer = kafka.consumer({ groupId: 'search-node-group-abcde' })

const connectConsumer = async () => {
  await consumer.connect()
  await consumer.subscribe({ topics: ['search.events'], fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { payload: payloadString, ...data } = JSON.parse(message.value!.toString())
      const payload = payloadString ? JSON.parse(payloadString) : null

      const logEntry: Prisma.EventLogCreateInput = {
        event: data.eventType,
        message: JSON.stringify(data),
        payload: payloadString || null
      }

      console.log(data)

      try {
        switch (data.eventType) {
          case EVENTS.FLIGHT_CREATED: {
            const content: FlightCreatedEvent = payload

            const code = content.flightNumber.slice(0, 2)
            const isCodeNumber = !Number.isNaN(parseInt(code))

            await prisma.flight.create({
              data: {
                id: content.flightId.toString(),
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
                airline: !isCodeNumber
                  ? {
                      connect: { code: content.flightNumber.slice(0, 2) }
                    }
                  : undefined,
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
            const content: FlightUpdatedEvent = payload

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
            const content: ReservationCreatedEvent = payload
console.log(content)
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
            const content: ReservationUpdatedEvent = payload

            await prisma.booking.update({
              where: { id: content.reservationId },
              data: {
                status: content.newStatus,
                bookingDate: content.reservationDate ? new Date(content.reservationDate) : undefined
              }
            })

            break
          }

          default:
            console.log(`No handler for event: ${payload.eventType}`)
        }
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          // P2002. "Unique constraint failed on the {constraint}".
          if (error.code === 'P2002') {
            // Handle unique constraint violation (e.g., duplicate entries)

            return
          } else {
            logEntry.error = JSON.stringify(error)
          }
        } else {
          logEntry.error = JSON.stringify(error)
        }
      } finally {
        await prisma.eventLog.create({ data: logEntry })
      }
    }
  })
}

type EventType = 'search.search.performed' | 'search.cart.item.added' | 'users.user.created'
type EventPayload<T extends EventType> = {
  'search.search.performed': SearchMetric
  'search.cart.item.added': BookingIntent
  'users.user.created': UserCreateEvent
}[T]

const postEvent = async <T extends EventType>(type: T, payload: EventPayload<T>) => {
  const now = new Date().toISOString()
  const messageId = `msg-${Date.now()}`
  const correlationId = `corr-${Date.now()}`
  const idempotencyKey = `search-${Date.now()}`

  await fetch(process.env.CORE_URL + '/events', {
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
