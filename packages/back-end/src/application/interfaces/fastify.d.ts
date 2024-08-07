import 'fastify'

import { Instructor } from '__data/schemas/instructor'
import { Student } from '__data/schemas/student'

declare module 'fastify' {
  interface FastifyRequest {
    user: Instructor | Student
  }
}
