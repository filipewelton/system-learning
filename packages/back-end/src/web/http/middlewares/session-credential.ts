import { FastifyRequest } from 'fastify'
import { verify } from 'jsonwebtoken'
import lodash from 'lodash'

import { NotFoundException } from '__application/exceptions/not-found'
import { UnauthorizedException } from '__application/exceptions/unauthorized'
import { env } from '__configs/environment'
import { PostgresInstructorRepository } from '__data/repositories/instructor/postgresql'
import { FindInstructorById } from '__domain/use-cases/instructor/find-by-id'

const instructorRepository = new PostgresInstructorRepository()
const findInstructorById = new FindInstructorById(instructorRepository)

export function validateSessionCredential(role: SessionCredentialRoles) {
  return async function (req: FastifyRequest) {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      throw 'Unauthorized token'
    }

    try {
      const rawPayload = verify(token, env.JWT_SECRET, {
        algorithms: ['HS256'],
      })

      if (typeof rawPayload === 'string') {
        throw 'Unauthorized token'
      }

      const parsedToken = lodash.pick(rawPayload, ['sub', 'role'])

      if (!parsedToken.role || !parsedToken.sub) {
        throw 'Unauthorized token'
      } else if (parsedToken.role !== role) {
        throw 'Unauthorized token'
      }

      const user = await findInstructorById.call(parsedToken.sub)

      req.user = user.instructor
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('User not found')
      }

      throw new UnauthorizedException(error as string)
    }
  }
}
