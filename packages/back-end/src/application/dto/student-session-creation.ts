import { z } from 'zod'

export const studentSessionCreationDto = z.object({
  email: z.string().email(),
})
