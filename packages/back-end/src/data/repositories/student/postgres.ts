import { ulid } from 'ulid'

import {
  StudentCreation,
  StudentRepository,
  StudentUpdate,
} from '__application/interfaces/student'
import { Student } from '__data/schemas/student'
import { DEFAULT_USER_AVATAR_URL } from '__domain/constants/cloud-storage'
import { database } from '__providers/database'

export class PostgresStudentRepository implements StudentRepository {
  async create(params: StudentCreation): Promise<Student> {
    return await database('Students')
      .insert(
        {
          ...params,
          id: ulid(),
          avatar: DEFAULT_USER_AVATAR_URL,
          isPaying: false,
        },
        '*',
      )
      .then(([student]) => student)
  }

  async findByEmail(email: string): Promise<Student | null> {
    return await database('Students')
      .select('*')
      .where('email', email)
      .first()
      .then((student) => student ?? null)
  }

  async findById(id: string): Promise<Student | null> {
    return await database('Students')
      .select('*')
      .where('id', id)
      .first()
      .then((result) => result ?? null)
  }

  async update(params: StudentUpdate): Promise<Student> {
    const { id } = params
    let payload: object

    if ('avatar' in params) {
      payload = { avatar: params.avatar }
    } else {
      payload = params.payload
    }

    return await database('Students')
      .update(payload, '*')
      .where('id', id)
      .then(([student]) => student)
  }
}
