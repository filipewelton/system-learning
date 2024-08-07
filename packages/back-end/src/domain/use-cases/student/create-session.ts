import { sign } from 'jsonwebtoken'

import { NotFoundException } from '__application/exceptions/not-found'
import { StudentRepository } from '__application/interfaces/student'
import { env } from '__configs/environment'

export class CreateStudentSession implements UseCase {
  constructor(private studentRepository: StudentRepository) {}

  async call(email: string) {
    const student = await this.studentRepository.findByEmail(email)

    if (!student) {
      throw new NotFoundException('Student not found', 'Email not registered')
    }

    const token = sign({ sub: 'student' }, env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '7 days',
    })

    return { student, token }
  }
}
