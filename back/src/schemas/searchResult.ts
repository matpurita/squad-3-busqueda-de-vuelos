import { z } from 'zod'
import { flightSchema } from './flight'
import { paginationSchema } from './pagination'

export const searchResultSchema = z.object({
  departure: flightSchema,
  return: flightSchema.optional(),
  pagination: paginationSchema
})

export type SearchResults = z.infer<typeof searchResultSchema>