import { NotFoundException } from '__application/exceptions/not-found'
import { StudentRepository } from '__application/interfaces/student'

export class FindStudentById implements UseCase {
  constructor(private studentRepository: StudentRepository) {}

  async call(studentId: string) {
    const student = await this.studentRepository.findById(studentId)

    if (!student) {
      throw new NotFoundException('Student not found')
    }

    return { student }
  }
}
