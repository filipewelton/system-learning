import { sign } from 'jsonwebtoken'

import { NotFoundException } from '__application/exceptions/not-found'
import { InstructorRepository } from '__application/interfaces/instructor'
import { env } from '__configs/environment'

export class CreateInstructorSession implements UseCase {
  constructor(private instructorRepository: InstructorRepository) {}

  async call(email: string) {
    const instructor = await this.instructorRepository.findByEmail(email)

    if (!instructor) {
      throw new NotFoundException('Instructor not found', 'Email not registered')
    }

    const token = sign({ sub: 'instructor' }, env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '7 days',
    })

    return { instructor, token }
  }
}
