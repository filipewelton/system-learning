import { z } from 'zod'

export const studentUpdateDto = z.object({
  routeParams: z.object({
    studentId: z.string().ulid(),
  }),
  body: z.object({
    name: z
      .string()
      .regex(
        /^(([A-Z]([a-z-]+|\.)\s?)+)$/,
        'The name should be in title case format',
      )
      .optional(),
  }),
})
