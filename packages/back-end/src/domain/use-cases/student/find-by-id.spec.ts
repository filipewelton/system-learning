import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { NotFoundException } from '__application/exceptions/not-found'
import { InMemoryStudentRepository } from '__data/repositories/student/in-memory'
import { mockStudentData } from '__mocks/student'

import { FindStudentById } from './find-by-id'

let studentRepository: InMemoryStudentRepository
let sut: FindStudentById

describe('Student listing', () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository()
    sut = new FindStudentById(studentRepository)
  })

  it('should be possible to find', async () => {
    const { id } = await studentRepository.create(mockStudentData())
    const { student } = await sut.call(id)

    expect(student).toHaveProperty('id')
    expect(student).toHaveProperty('name')
    expect(student).toHaveProperty('email')
    expect(student).toHaveProperty('avatar')
    expect(student).toHaveProperty('isPaying')
  })

  it("shouldn't be possible to find whe the student doesn't exist", async () => {
    const id = faker.string.nanoid()
    expect(sut.call(id)).rejects.toBeInstanceOf(NotFoundException)
  })
})
