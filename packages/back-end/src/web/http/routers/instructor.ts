import fastifyMultipart from '@fastify/multipart'
import { FastifyInstance } from 'fastify'

import {
  create,
  createSession,
  findAll,
  findById,
  findByName,
  getResultPageCount,
  update,
  uploadAvatar,
} from '../controllers/instructor'
import { validateSessionCredential } from '../middlewares/session-credential'

const oneHundredThousandBytes = 1000 * 100

export async function instructorRouter(app: FastifyInstance) {
  app.post('/', create)
  app.post('/session', createSession)
  app.get('/', findAll)
  app.get('/:instructorId', findById)
  app.get('/count', getResultPageCount)
  app.get('/search', findByName)

  app.patch(
    '/:instructorId',
    { preHandler: [validateSessionCredential('instructor')] },
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
      '/:instructorId/avatar',
      { preHandler: [validateSessionCredential('instructor')] },
      uploadAvatar,
    )
}
