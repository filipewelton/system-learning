import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { NotFoundException } from '__application/exceptions/not-found'
import { InMemoryInstructorRepository } from '__data/repositories/instructor/in-memory'
import { mockInstructorData } from '__mocks/instructor'

import { FindInstructorById } from './find-by-id'

let instructorRepository: InMemoryInstructorRepository
let sut: FindInstructorById

describe('Instructor listing', () => {
  beforeEach(() => {
    instructorRepository = new InMemoryInstructorRepository()
    sut = new FindInstructorById(instructorRepository)
  })

  it('should be possible to find', async () => {
    const { id } = await instructorRepository.create(mockInstructorData())
    const { instructor } = await sut.call(id)

    expect(instructor).toHaveProperty('id')
    expect(instructor).toHaveProperty('name')
    expect(instructor).toHaveProperty('email')
    expect(instructor).toHaveProperty('avatar')
    expect(instructor).toHaveProperty('bio')
  })

  it("shouldn't be possible to find whe the instructor doesn't exist", async () => {
    const id = faker.string.nanoid()
    expect(sut.call(id)).rejects.toBeInstanceOf(NotFoundException)
  })
})
