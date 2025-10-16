import { z } from 'zod'

export const AuthPayloadSchema = z.object({
  userId: z.string(),
  email: z.string(),
  rol: z.string(),
  exp: z.number(),
  iat: z.number()
})

export type AuthPayload = z.infer<typeof AuthPayloadSchema>
