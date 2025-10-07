import z from 'zod'
import { airportSchema } from './airport'
import { airlineSchema } from './airline'
import { planeSchema } from './plane'

export const flightSchema = z.object({
  flightNumber: z.string(),
  departure: z.date(),
  arrival: z.date(),
  origin: airportSchema,
  destination: airportSchema,
  airline: airlineSchema,
  plane: planeSchema.nullable(),
  price: z.number(),
  currency: z.string().length(3),
  state: z.string()
})

export type Flight = z.infer<typeof flightSchema>
