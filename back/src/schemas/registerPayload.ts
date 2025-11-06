import z from 'zod'

export const registerPayloadSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  nacionalidad: z.string()
})

export type RegisterPayload = z.infer<typeof registerPayloadSchema>
