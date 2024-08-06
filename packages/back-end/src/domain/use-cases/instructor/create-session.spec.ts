import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { NotFoundException } from '__application/exceptions/not-found'
import { InMemoryInstructorRepository } from '__data/repositories/instructor/in-memory'
import { mockInstructorData } from '__mocks/instructor'

import { CreateInstructorSession } from './create-session'

let instructorRepository: InMemoryInstructorRepository
let sut: CreateInstructorSession

describe('Instructor session creation', () => {
  beforeEach(() => {
    instructorRepository = new InMemoryInstructorRepository()
    sut = new CreateInstructorSession(instructorRepository)
  })

  it('should be possible to create', async () => {
    const { email } = await instructorRepository.create(mockInstructorData())
    const { instructor, token } = await sut.call(email)

    expect(instructor).toHaveProperty('id')
    expect(instructor).toHaveProperty('name')
    expect(instructor).toHaveProperty('email')
    expect(instructor).toHaveProperty('avatar')
    expect(token).toBeTypeOf('string')
  })

  it("shouldn't be possible to create when the instructor doesn't exist", async () => {
    const email = faker.internet.email()
    expect(sut.call(email)).rejects.toBeInstanceOf(NotFoundException)
  })
})
