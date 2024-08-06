import { z } from 'zod'

export const instructorSearchByNameDto = z.object({
  name: z.string().min(2),
  page: z.coerce.number().min(1).default(1),
})
