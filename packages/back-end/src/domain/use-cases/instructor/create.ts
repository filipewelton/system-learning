import { ConflictException } from '__application/exceptions/conflict'
import {
  InstructorCreation,
  InstructorRepository,
} from '__application/interfaces/instructor'
import { ResultPageCountRepository } from '__application/interfaces/result-page-count'

export class CreateInstructor implements UseCase {
  constructor(
    private instructorRepository: InstructorRepository,
    private resultPageCountRepository: ResultPageCountRepository,
  ) {}

  async call(params: InstructorCreation) {
    const someoneWithTheSameEmail = await this.instructorRepository.findByEmail(
      params.email,
    )

    if (someoneWithTheSameEmail) {
      throw new ConflictException('Email already registered')
    }

    await this.resultPageCountRepository.increaseResultPageCount('instructor')
    await this.instructorRepository.create(params)
  }
}
