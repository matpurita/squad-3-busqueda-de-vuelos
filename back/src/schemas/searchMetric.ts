import { z } from 'zod'

export const searchMetricSchema = z.object({
  userId: z.string().optional(),
  flightsFrom: z.string(),
  flightsTo: z.string(),
  departureDate: z.string(),
  returnDate: z.string().optional(),
  resultsCount: z.number().int().nonnegative(),
  timestamp: z.date().default(new Date())
})

export type SearchMetric = z.infer<typeof searchMetricSchema>
