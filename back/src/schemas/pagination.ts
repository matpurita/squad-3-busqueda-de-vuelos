import z from 'zod'

export const paginationSchema = z.object({
  total: z.number(),
  limit: z.number(),
  offset: z.number()
})

export type Pagination = z.infer<typeof paginationSchema>
