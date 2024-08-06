import { InstructorRepository } from '__application/interfaces/instructor'
import { Instructor } from '__data/schemas/instructor'

interface InstructorUpdateParams {
  instructor: Instructor
  payload: {
    name?: string
    bio?: string
  }
}

export class UpdateInstructor implements UseCase {
  constructor(private instructorRepository: InstructorRepository) {}

  async call(params: InstructorUpdateParams) {
    const updatedInstructor = await this.instructorRepository.update({
      id: params.instructor.id,
      payload: params.payload,
    })

    return { instructor: updatedInstructor }
  }
}
