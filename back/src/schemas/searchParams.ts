import z from 'zod'

export const searchSchema = z.object({
  origin: z.string().min(3).max(3),
  destination: z.string().min(3).max(3),
  departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  departureRange: z.coerce.number().min(0).max(7).default(0),
  returnDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  returnRange: z.coerce.number().min(0).max(7).default(0),
  passengers: z.coerce.number().min(1).max(9).default(1),
  cabinClass: z.enum(['Economy', 'Premium Economy', 'Business', 'First']).optional(),
  nonStop: z.coerce.boolean().default(false),
  currency: z.string().length(3).default('USD'),
  sort: z.enum(['price_asc', 'price_desc', 'duration_asc', 'duration_desc']).optional(),
  limit: z.coerce.number().min(1).max(50).default(10),
  offset: z.coerce.number().min(0).default(0)
})

export type SearchParams = z.infer<typeof searchSchema>
