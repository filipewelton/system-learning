import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryInstructorRepository } from '__data/repositories/instructor/in-memory'
import { mockInstructorData } from '__mocks/instructor'

import { UpdateInstructor } from './update'

let instructorRepository: InMemoryInstructorRepository
let sut: UpdateInstructor

describe('Instructor update', () => {
  beforeEach(() => {
    instructorRepository = new InMemoryInstructorRepository()
    sut = new UpdateInstructor(instructorRepository)
  })

  it('should be possible to update', async () => {
    const instructor = await instructorRepository.create(mockInstructorData())
    const bio = faker.lorem.words()

    const { instructor: result } = await sut.call({
      instructor,
      payload: { bio },
    })

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('email')
    expect(result).toHaveProperty('avatar')
    expect(result.bio).toEqual(bio)
  })
})
