import z from 'zod'
import { classSchema } from './class'

export const seatSchema = z.object({
  price: z.number(),
  seatNumber: z.string(),
  isAvailable: z.boolean().default(true),
  class: classSchema.nullable()
})

export type Seat = z.infer<typeof seatSchema>
