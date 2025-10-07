import z from 'zod'

export const planeSchema = z.object({
  model: z.string(),
  capacity: z.number()
})

export type Plane = z.infer<typeof planeSchema>
