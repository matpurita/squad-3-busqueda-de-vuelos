import { z } from 'zod'

export const flightBookingSchema = z.object({
  userId: z.string(),
  flightId: z.string(),
  timestamp: z.date().default(new Date())
})

export type FlightBooking = z.infer<typeof flightBookingSchema>