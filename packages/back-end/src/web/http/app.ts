import cors from '@fastify/cors'
import fastify from 'fastify'
import lodash from 'lodash'
import { ZodError } from 'zod'

import { Exception } from '__application/exceptions/exception'

import { instructorRouter } from './routers/instructor'

const app = fastify()

app.register(cors, {
  origin: '*',
})

app.register(instructorRouter, { prefix: 'instructors' })

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof Exception) {
    return reply.status(error.status).send({
      error: lodash.pick(error, ['message', 'name', 'reason']),
    })
  } else if (error instanceof ZodError) {
    return reply.status(400).send({ error: error.issues })
  }

  console.error(error)

  reply.status(500).send({
    error: { message: 'Internal server error' },
  })
})

export { app }
