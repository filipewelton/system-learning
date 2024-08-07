import { StudentRepository } from '__application/interfaces/student'
import { Student } from '__data/schemas/student'

interface StudentUpdateParams {
  student: Student
  payload: {
    name?: string
  }
}

export class UpdateStudent implements UseCase {
  constructor(private studentRepository: StudentRepository) {}

  async call(params: StudentUpdateParams) {
    const { payload, student } = params

    const updatedStudent = await this.studentRepository.update({
      payload,
      id: student.id,
    })

    return { student: updatedStudent }
  }
}
