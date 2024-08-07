import { faker } from '@faker-js/faker'
import { beforeEach, expect, it } from 'vitest'

import { InMemoryStudentRepository } from '__data/repositories/student/in-memory'
import { mockStudentData } from '__mocks/student'

import { UpdateStudent } from './update'

let studentRepository: InMemoryStudentRepository
let sut: UpdateStudent

beforeEach(() => {
  studentRepository = new InMemoryStudentRepository()
  sut = new UpdateStudent(studentRepository)
})

it('should be possible to update', async () => {
  const student = await studentRepository.create(mockStudentData())

  const { student: result } = await sut.call({
    student,
    payload: {
      name: faker.person.firstName() + ' ' + faker.person.lastName(),
    },
  })

  expect(result).toHaveProperty('id')
  expect(result).toHaveProperty('name')
  expect(result).toHaveProperty('email')
  expect(result).toHaveProperty('avatar')
  expect(result).toHaveProperty('isPaying')
})
