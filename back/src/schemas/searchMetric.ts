import { z } from 'zod'

export const searchMetricSchema = z.object({
  userId: z.string().optional(),
  flightsFrom: z.string(),
  flightsTo: z.string(),
  dateFrom: z.string(),
  dateTo: z.string(),
  resultsCount: z.number().int().nonnegative(),
  timestamp: z.date().default(new Date())
})

export type SearchMetric = z.infer<typeof searchMetricSchema>
