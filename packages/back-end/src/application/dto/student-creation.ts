import { z } from 'zod'

export const studentCreationDto = z.object({
  email: z.string().email(),
  name: z
    .string()
    .regex(
      /^(([A-Z]([a-z]+|\.)\s?)+)$/,
      'The name should be in title case format',
    ),
})
