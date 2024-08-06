import 'fastify'

import { Instructor } from '__data/schemas/instructor'

declare module 'fastify' {
  interface FastifyRequest {
    user: Instructor
  }
}
