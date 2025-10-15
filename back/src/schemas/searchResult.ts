import { z } from 'zod'
import { flightSchema } from './flight'

export const searchResultSchema = z.object({
  departure: flightSchema.nullable(),
  return: flightSchema.nullable().optional(),
  totalPrice: z.number()
})

export type SearchResults = z.infer<typeof searchResultSchema>