import { InstructorRepository } from '__application/interfaces/instructor'

interface InstructorSearchByName {
  name: string
  page: number
}

export class FindInstructorsByName implements UseCase {
  constructor(private instructorRepository: InstructorRepository) {}

  async call(params: InstructorSearchByName) {
    const { name, page } = params
    const instructors = await this.instructorRepository.findByName(name, page)
    return { instructors }
  }
}
