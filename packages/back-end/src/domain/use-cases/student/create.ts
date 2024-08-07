import { ConflictException } from '__application/exceptions/conflict'
import { ResultPageCountRepository } from '__application/interfaces/result-page-count'
import {
  StudentCreation,
  StudentRepository,
} from '__application/interfaces/student'

export class CreateStudent implements UseCase {
  constructor(
    private studentRepository: StudentRepository,
    private resultPageCountRepository: ResultPageCountRepository,
  ) {}

  async call(params: StudentCreation) {
    const { email } = params
    const thereIsAStudentWithSameEmail =
      await this.studentRepository.findByEmail(email)

    if (thereIsAStudentWithSameEmail) {
      throw new ConflictException('Email already registered')
    }

    await this.resultPageCountRepository.increaseResultPageCount('student')
    await this.studentRepository.create(params)
  }
}
