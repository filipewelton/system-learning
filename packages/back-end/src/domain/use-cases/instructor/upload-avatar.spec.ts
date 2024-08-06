import { faker } from '@faker-js/faker'
import { MultipartFile } from '@fastify/multipart'
import { beforeEach, expect, it } from 'vitest'

import { InvalidDataInputException } from '__application/exceptions/invalid-data-input'
import { NotFoundException } from '__application/exceptions/not-found'
import { CloudStorageUploadRepository } from '__data/repositories/background-jobs/cloud-storage-upload'
import { InMemoryInstructorRepository } from '__data/repositories/instructor/in-memory'
import { mockInstructorData } from '__mocks/instructor'
import { FakeBackgroundJobProvider } from '__providers/fake-background-jobs'

import { UploadInstructorAvatar } from './upload-avatar'

const file = Promise.resolve({
  filename: faker.lorem.word() + '.png',
  mimetype: 'image/png',
  file: {
    read: () => Buffer.from(''),
  },
} as MultipartFile)

let backgroundJobProvider: FakeBackgroundJobProvider
let uploadRepository: CloudStorageUploadRepository
let instructorRepository: InMemoryInstructorRepository
let sut: UploadInstructorAvatar

beforeEach(() => {
  backgroundJobProvider = new FakeBackgroundJobProvider()
  uploadRepository = new CloudStorageUploadRepository(backgroundJobProvider)
  instructorRepository = new InMemoryInstructorRepository()
  sut = new UploadInstructorAvatar(uploadRepository, instructorRepository)
})

it('should be possible to upload', async () => {
  const instructor = await instructorRepository.create(mockInstructorData())

  return new Promise<void>((resolve, reject) => {
    backgroundJobProvider.listenJobEvent('completed', resolve)

    sut
      .call({ file, instructor })
      .then(({ instructor: result }) => {
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
  const instructor = await instructorRepository.create(mockInstructorData())

  await sut.call({ file, instructor })
  await sut.call({ file, instructor })

  return new Promise<void>((resolve, reject) => {
    backgroundJobProvider.listenJobEvent('completed', resolve)

    sut
      .call({ file, instructor })
      .then(({ instructor: result }) => {
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

  const instructor = await instructorRepository.create(mockInstructorData())

  expect(sut.call({ file, instructor })).rejects.toBeInstanceOf(
    InvalidDataInputException,
  )
})

it("shouldn't be possible to upload when the file is missing", async () => {
  const instructor = await instructorRepository.create(mockInstructorData())

  expect(
    sut.call({
      instructor,
      file: Promise.resolve(undefined),
    }),
  ).rejects.toBeInstanceOf(NotFoundException)
})
