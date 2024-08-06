import { InstructorRepository } from '__application/interfaces/instructor'

export class FindAllInstructors implements UseCase {
  constructor(private instructorRepository: InstructorRepository) {}

  async call(page: number) {
    const instructors = await this.instructorRepository.findAll(page)
    return { instructors }
  }
}
