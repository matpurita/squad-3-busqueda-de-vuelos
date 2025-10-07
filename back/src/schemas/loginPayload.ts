import z from 'zod'

export const loginPayloadSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
})

export type LoginPayload = z.infer<typeof loginPayloadSchema>
