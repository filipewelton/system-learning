import { Instructor } from '__data/schemas/instructor'

export type InstructorCreation = Omit<Instructor, 'id' | 'avatar'>

export type InstructorUpdate =
  | {
      id: string
      payload: { name?: string; bio?: string }
    }
  | {
      id: string
      avatar: string
    }

export interface InstructorRepository {
  create(params: InstructorCreation): Promise<Instructor>
  findAll(page: number): Promise<Instructor[]>
  findByEmail(email: string): Promise<Instructor | null>
  findById(id: string): Promise<Instructor | null>
  findByName(name: string, page: number): Promise<Instructor[]>
  update(params: InstructorUpdate): Promise<Instructor>
}
