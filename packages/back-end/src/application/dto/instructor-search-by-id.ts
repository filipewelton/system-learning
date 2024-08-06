import { z } from 'zod'

export const instructorSearchByIdDto = z.object({
  instructorId: z.string().ulid(),
})
