import { ulid } from 'ulid'

import {
  InstructorCreation,
  InstructorRepository,
  InstructorUpdate,
} from '__application/interfaces/instructor'
import { Instructor } from '__data/schemas/instructor'
import { DEFAULT_USER_AVATAR_URL } from '__domain/constants/cloud-storage'
import { ITEMS_PER_PAGE } from '__domain/constants/database-query-pagination'

export class InMemoryInstructorRepository implements InstructorRepository {
  db = new Array<Instructor>()

  async create(params: InstructorCreation): Promise<Instructor> {
    const instructor: Instructor = {
      ...params,
      avatar: DEFAULT_USER_AVATAR_URL,
      id: ulid(),
    }

    this.db.push(instructor)
    return instructor
  }

  async findAll(page: number): Promise<Instructor[]> {
    const offset = (page - 1) * ITEMS_PER_PAGE
    return this.db.slice(offset, offset + ITEMS_PER_PAGE)
  }

  async findByEmail(email: string): Promise<Instructor | null> {
    const instructor = this.db.find((instructor) => instructor.email === email)
    return instructor ?? null
  }

  async findById(id: string): Promise<Instructor | null> {
    const instructor = this.db.find((instructor) => instructor.id === id)
    return instructor ?? null
  }

  async findByName(name: string, page: number): Promise<Instructor[]> {
    const offset = (page - 1) * ITEMS_PER_PAGE

    const instructor = this.db
      .filter((instructor) => instructor.name.match(name))
      .slice(offset, offset + ITEMS_PER_PAGE)

    return instructor
  }

  async update(params: InstructorUpdate): Promise<Instructor> {
    const { id } = params
    const index = this.db.findIndex((instructor) => instructor.id === id)
    let payload: object

    if ('avatar' in params) {
      payload = { avatar: params.avatar }
    } else {
      payload = params.payload
    }

    const updatedInstructor: Instructor = {
      ...this.db[index],
      ...payload,
    }

    this.db[index] = updatedInstructor
    return updatedInstructor
  }
}
