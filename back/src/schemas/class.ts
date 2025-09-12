import z from 'zod'

export const classSchema = z.object({
  name: z.literal(['Economy', 'Premium Economy', 'Business', 'First'])
})

export type Class = z.infer<typeof classSchema>
