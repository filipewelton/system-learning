import { z } from 'zod'

export const instructorUpdateDto = z.object({
  routeParams: z.object({
    instructorId: z.string().ulid(),
  }),
  body: z.object({
    name: z
      .string()
      .regex(
        /^(([A-Z]([a-z]+|\.)\s?)+)$/,
        'The name should be in title case format',
      )
      .optional(),
    bio: z.string().max(255).optional(),
  }),
})
