import { faker } from '@faker-js/faker'
import { beforeEach, expect, it } from 'vitest'

import { ConflictException } from '__application/exceptions/conflict'
import { InMemoryResultPageCountRepository } from '__data/repositories/result-page-count/in-memory'
import { InMemoryStudentRepository } from '__data/repositories/student/in-memory'
import { mockStudentData } from '__mocks/student'

import { CreateStudent } from './create'

let studentRepository: InMemoryStudentRepository
let resultPageCountRepository: InMemoryResultPageCountRepository
let sut: CreateStudent

beforeEach(() => {
  studentRepository = new InMemoryStudentRepository()
  resultPageCountRepository = new InMemoryResultPageCountRepository()
  sut = new CreateStudent(studentRepository, resultPageCountRepository)
})

it('should be possible to create', async () => {
  await sut.call(mockStudentData())
})

it("shouldn't be possible to create when the email already registered", async () => {
  const email = faker.internet.email()

  await sut.call({ ...mockStudentData(), email })

  expect(
    sut.call({
      ...mockStudentData(),
      email,
    }),
  ).rejects.toBeInstanceOf(ConflictException)
})
