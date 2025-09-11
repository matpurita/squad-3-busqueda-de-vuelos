import { z } from 'zod'
import { flightSchema } from './flight'

export const searchResultSchema = z.object({
  departure: flightSchema,
  return: flightSchema.optional(),
  totalPrice: z.number()
})

export type SearchResults = z.infer<typeof searchResultSchema>