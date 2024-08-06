import { NotFoundException } from '__application/exceptions/not-found'
import { InstructorRepository } from '__application/interfaces/instructor'

export class FindInstructorById implements UseCase {
  constructor(private instructorRepository: InstructorRepository) {}

  async call(instructorId: string) {
    const instructor = await this.instructorRepository.findById(instructorId)

    if (!instructor) {
      throw new NotFoundException('Instructor not found')
    }

    return { instructor }
  }
}
