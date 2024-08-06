import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { ConflictException } from '__application/exceptions/conflict'
import { InMemoryResultPageCountRepository } from '__data/repositories/result-page-count/in-memory'
import { InMemoryInstructorRepository } from '__data/repositories/instructor/in-memory'

import { CreateInstructor } from './create'

let instructorRepository: InMemoryInstructorRepository
let resultPageCountRepository: InMemoryResultPageCountRepository
let sut: CreateInstructor

describe('Instructor creation', () => {
  beforeEach(() => {
    instructorRepository = new InMemoryInstructorRepository()
    resultPageCountRepository = new InMemoryResultPageCountRepository()
    sut = new CreateInstructor(instructorRepository, resultPageCountRepository)
  })

  it('should be possible to create', async () => {
    await sut.call({
      email: faker.internet.email(),
      name: faker.person.fullName(),
    })
  })

  it("shouldn't be possible to create when the instructor doesn't exist", async () => {
    const email = faker.internet.email()

    await sut.call({
      email,
      name: faker.person.fullName(),
    })

    expect(
      sut.call({
        email,
        name: faker.person.fullName(),
      }),
    ).rejects.toBeInstanceOf(ConflictException)
  })
})
