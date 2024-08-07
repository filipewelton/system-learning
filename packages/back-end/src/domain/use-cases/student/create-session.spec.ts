import { faker } from '@faker-js/faker'
import { beforeEach, expect, it } from 'vitest'

import { NotFoundException } from '__application/exceptions/not-found'
import { InMemoryStudentRepository } from '__data/repositories/student/in-memory'
import { mockStudentData } from '__mocks/student'

import { CreateStudentSession } from './create-session'

let studentRepository: InMemoryStudentRepository
let sut: CreateStudentSession

beforeEach(() => {
  studentRepository = new InMemoryStudentRepository()
  sut = new CreateStudentSession(studentRepository)
})

it('should be possible to create', async () => {
  const { email } = await studentRepository.create(mockStudentData())
  const { student, token } = await sut.call(email)

  expect(student).toHaveProperty('id')
  expect(student).toHaveProperty('name')
  expect(student).toHaveProperty('email')
  expect(student).toHaveProperty('avatar')
  expect(token).toBeTypeOf('string')
})

it("shouldn't be possible to create when the student doesn't exist", async () => {
  const email = faker.internet.email()
  expect(sut.call(email)).rejects.toBeInstanceOf(NotFoundException)
})
