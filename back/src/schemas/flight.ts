import z from 'zod'
import { airportSchema } from './airport'
import { airlineSchema } from './airline'
import { seatSchema } from './seat'

export const flightSchema = z.object({
  id: z.string(),
  flightNumber: z.string(),
  departure: z.date(),
  arrival: z.date(),
  duration: z.number(),
  origin: airportSchema,
  destination: airportSchema,
  airline: airlineSchema,
  minPrice: z.number(),
  availableSeats: z.number(),
  currency: z.string().length(3),
  seats: z.array(seatSchema).optional(),
  selectedSeat: seatSchema.optional()
})

export type Flight = z.infer<typeof flightSchema>
