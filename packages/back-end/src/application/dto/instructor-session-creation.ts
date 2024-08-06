import { z } from 'zod'

export const instructorSessionCreationDto = z.object({
  email: z.string().email(),
})
