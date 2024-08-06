import { ulid } from 'ulid'

import {
  InstructorCreation,
  InstructorRepository,
  InstructorUpdate,
} from '__application/interfaces/instructor'
import { Instructor } from '__data/schemas/instructor'
import { DEFAULT_USER_AVATAR_URL } from '__domain/constants/cloud-storage'
import { ITEMS_PER_PAGE } from '__domain/constants/database-query-pagination'
import { database } from '__providers/database'

export class PostgresInstructorRepository implements InstructorRepository {
  async create(params: InstructorCreation): Promise<Instructor> {
    return await database('Instructors')
      .insert(
        {
          ...params,
          id: ulid(),
          bio: null,
          avatar: DEFAULT_USER_AVATAR_URL,
        },
        '*',
      )
      .then(([instructor]) => instructor)
  }

  async findAll(page: number): Promise<Instructor[]> {
    const offset = (page - 1) * ITEMS_PER_PAGE

    return await database('Instructors')
      .select('*')
      .offset(offset)
      .limit(ITEMS_PER_PAGE)
  }

  async findByEmail(email: string): Promise<Instructor | null> {
    return await database('Instructors')
      .select('*')
      .where('email', email)
      .first()
      .then((result) => result ?? null)
  }

  async findById(id: string): Promise<Instructor | null> {
    return await database('Instructors')
      .select('*')
      .where('id', id)
      .first()
      .then((result) => result ?? null)
  }

  async findByName(name: string, page: number): Promise<Instructor[]> {
    const offset = (page - 1) * ITEMS_PER_PAGE

    return await database('Instructors')
      .select('*')
      .where('name', 'like', `%${name}%`)
      .offset(offset)
      .limit(ITEMS_PER_PAGE)
  }

  async update(params: InstructorUpdate): Promise<Instructor> {
    const { id } = params
    let payload: object

    if ('avatar' in params) {
      payload = { avatar: params.avatar }
    } else {
      payload = params.payload
    }

    return await database('Instructors')
      .update(payload, '*')
      .where('id', id)
      .then(([instructor]) => instructor)
  }
}
