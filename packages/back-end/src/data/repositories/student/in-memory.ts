import { ulid } from 'ulid'

import {
  StudentCreation,
  StudentRepository,
  StudentUpdate,
} from '__application/interfaces/student'
import { Student } from '__data/schemas/student'
import { DEFAULT_USER_AVATAR_URL } from '__domain/constants/cloud-storage'

export class InMemoryStudentRepository implements StudentRepository {
  private db = new Array<Student>()

  async create(params: StudentCreation): Promise<Student> {
    const student: Student = {
      ...params,
      id: ulid(),
      avatar: DEFAULT_USER_AVATAR_URL,
      isPaying: false,
    }

    this.db.push(student)
    return student
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.db.find((student) => student.email === email)
    return student ?? null
  }

  async findById(id: string): Promise<Student | null> {
    const student = this.db.find((student) => student.id === id)
    return student ?? null
  }

  async update(params: StudentUpdate): Promise<Student> {
    const { id } = params
    const index = this.db.findIndex((student) => student.id === id)
    let data: object

    if ('avatar' in params) {
      data = { avatar: params.avatar }
    } else if ('isPaying' in params) {
      data = { isPaying: params.isPaying }
    } else {
      data = params.payload
    }

    const updatedStudent: Student = {
      ...this.db[index],
      ...data,
    }

    this.db[index] = updatedStudent
    return updatedStudent
  }
}
