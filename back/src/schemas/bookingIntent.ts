import { z } from 'zod'

export const bookingIntentSchema = z.object({
  userId: z.string(),
  flightId: z.string(),
  addedAt: z.date().default(new Date())
})

export type BookingIntent = z.infer<typeof bookingIntentSchema>