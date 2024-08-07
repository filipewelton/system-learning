import { z } from 'zod'

export const studentAvatarUploadDto = z.object({
  studentId: z.string().ulid(),
})
