import { z } from 'zod'

export const AuthPayloadSchema = z.object({
  userId: z.string(),
  email: z.string(),
  roles: z.array(z.string()).optional(),
  exp: z.number().optional()
})

export type AuthPayload = z.infer<typeof AuthPayloadSchema>
