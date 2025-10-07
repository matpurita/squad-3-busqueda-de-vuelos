import z from 'zod'

export const airportSchema = z.object({
  code: z.string().length(3),
  name: z.string(),
  city: z.string(),
  country: z.string()
})

export type Airport = z.infer<typeof airportSchema>
