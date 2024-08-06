import { z } from 'zod'

export const instructorAvatarUploadDto = z.object({
  instructorId: z.string().ulid(),
})
