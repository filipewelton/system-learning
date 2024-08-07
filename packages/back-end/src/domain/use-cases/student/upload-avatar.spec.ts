import { faker } from '@faker-js/faker'
import { MultipartFile } from '@fastify/multipart'
import { beforeEach, expect, it } from 'vitest'

import { InvalidDataInputException } from '__application/exceptions/invalid-data-input'
import { NotFoundException } from '__application/exceptions/not-found'
import { CloudStorageUploadRepository } from '__data/repositories/background-jobs/cloud-storage-upload'
import { InMemoryStudentRepository } from '__data/repositories/student/in-memory'
import { mockStudentData } from '__mocks/student'
import { FakeBackgroundJobProvider } from '__providers/fake-background-jobs'

import { UploadStudentAvatar } from './upload-avatar'

const file = Promise.resolve({
  filename: faker.lorem.word() + '.png',
  mimetype: 'image/png',
  file: {
    read: () => Buffer.from(''),
  },
} as MultipartFile)

let backgroundJobProvider: FakeBackgroundJobProvider
let uploadRepository: CloudStorageUploadRepository
let studentRepository: InMemoryStudentRepository
let sut: UploadStudentAvatar

beforeEach(() => {
  backgroundJobProvider = new FakeBackgroundJobProvider()
  uploadRepository = new CloudStorageUploadRepository(backgroundJobProvider)
  studentRepository = new InMemoryStudentRepository()
  sut = new UploadStudentAvatar(uploadRepository, studentRepository)
})

it('should be possible to upload', async () => {
  const student = await studentRepository.create(mockStudentData())

  return new Promise<void>((resolve, reject) => {
    backgroundJobProvider.listenJobEvent('completed', resolve)

    sut
      .call({ file, student })
      .then(({ student: result }) => {
        expect(result).toHaveProperty('id')
        expect(result).toHaveProperty('name')
        expect(result).toHaveProperty('email')
        expect(result).toHaveProperty('avatar')
        expect(result).toHaveProperty('bio')
      })
      .catch(reject)
  })
})

it('should be possible to upload multiple times', async () => {
  const student = await studentRepository.create(mockStudentData())

  await sut.call({ file, student })
  await sut.call({ file, student })

  return new Promise<void>((resolve, reject) => {
    backgroundJobProvider.listenJobEvent('completed', resolve)

    sut
      .call({ file, student })
      .then(({ student: result }) => {
        expect(result).toHaveProperty('id')
        expect(result).toHaveProperty('name')
        expect(result).toHaveProperty('email')
        expect(result).toHaveProperty('avatar')
        expect(result).toHaveProperty('bio')
      })
      .catch(reject)
  })
})

it("shouldn't be possible to upload when the file type is not allowed", async () => {
  const file = Promise.resolve({
    filename: faker.lorem.word() + '.wav',
    mimetype: 'image/wav',
    file: {
      read: () => Buffer.from(''),
    },
  } as MultipartFile)

  const student = await studentRepository.create(mockStudentData())

  expect(sut.call({ file, student })).rejects.toBeInstanceOf(
    InvalidDataInputException,
  )
})

it("shouldn't be possible to upload when the file is missing", async () => {
  const student = await studentRepository.create(mockStudentData())

  expect(
    sut.call({
      student,
      file: Promise.resolve(undefined),
    }),
  ).rejects.toBeInstanceOf(NotFoundException)
})
