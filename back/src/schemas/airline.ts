import z from 'zod'

export const airlineSchema = z.object({
  code: z.string(),
  name: z.string()
})

export type Airline = z.infer<typeof airlineSchema>
