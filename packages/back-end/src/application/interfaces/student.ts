import { Student } from '__data/schemas/student'

export interface StudentCreation {
  name: string
  email: string
}

export interface StudentUpdate {
  id: string
  payload?: { name?: string }
  avatar?: string
  isPaying?: boolean
}

export interface StudentRepository {
  create(params: StudentCreation): Promise<Student>
  findByEmail(email: string): Promise<Student | null>
  findById(id: string): Promise<Student | null>
  update(params: StudentUpdate): Promise<Student>
}
