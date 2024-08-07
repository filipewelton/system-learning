import fastifyMultipart from '@fastify/multipart'
import { FastifyInstance } from 'fastify'

import {
  createSession,
  createStudent,
  getResultPageCount,
  update,
  uploadAvatar,
} from '../controllers/student'
import { validateSessionCredential } from '../middlewares/session-credential'

const oneHundredThousandBytes = 1000 * 100

export async function studentRouter(app: FastifyInstance) {
  app.post('/', createStudent)
  app.get('/count', getResultPageCount)
  app.post('/session', createSession)

  app.patch(
    '/:studentId',
    { preHandler: [validateSessionCredential('student')] },
    update,
  )

  app
    .register(fastifyMultipart, {
      limits: {
        fieldNameSize: 100,
        fieldSize: 100,
        fields: 1,
        files: 1,
        fileSize: oneHundredThousandBytes,
        parts: 1000,
      },
    })
    .put(
      '/:studentId/avatar',
      { preHandler: [validateSessionCredential('student')] },
      uploadAvatar,
    )
}
