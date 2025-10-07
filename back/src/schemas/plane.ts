import z from 'zod'

export const planeSchema = z.object({
  id: z.string(),
  model: z.string(),
  capacity: z.number()
})

export type Plane = z.infer<typeof planeSchema>
