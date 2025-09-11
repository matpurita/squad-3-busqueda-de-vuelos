import z from 'zod'

export const seatSchema = z.object({
  price: z.number(),
  seatNumber: z.string()
})

export type Seat = z.infer<typeof seatSchema>
