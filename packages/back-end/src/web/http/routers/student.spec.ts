import { faker } from '@faker-js/faker'
import { rmSync, writeFileSync } from 'fs'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { generateSessionCredential } from '__application/libs/session-credential-generation'
import { FirebaseCloudStorageRepository } from '__data/repositories/cloud-storage/firebase'
import { PostgresStudentRepository } from '__data/repositories/student/postgres'
import { mockStudentData } from '__mocks/student'
import { BullBackgroundJobProvider } from '__providers/bull-background-jobs'
import { cache } from '__providers/cache'
import { FirebaseCloudStorageProvider } from '__providers/firebase-cloud-storage'

import { app } from '../app'

let studentRepository: PostgresStudentRepository
let cloudStorageProvider: FirebaseCloudStorageProvider
let cloudStorageRepository: FirebaseCloudStorageRepository
let backgroundJob: BullBackgroundJobProvider

beforeAll(async () => {
  await app.ready()

  studentRepository = new PostgresStudentRepository()
  cloudStorageProvider = new FirebaseCloudStorageProvider()

  cloudStorageRepository = new FirebaseCloudStorageRepository(
    cloudStorageProvider,
  )

  backgroundJob = new BullBackgroundJobProvider(cloudStorageRepository)
})

afterAll(async () => {
  await app.close()
  await cache.flushall()
})

describe('Student creation', () => {
  it('should be possible to create', async () => {
    const { status } = await supertest(app.server).post('/students').send({
      email: faker.internet.email(),
      name: 'John Doe',
    })

    expect(status).toEqual(204)
  })
})

describe('Getting result page count', () => {
  it('should be possible to get', async () => {
    const { status, body } = await supertest(app.server).get('/students/count')

    expect(status).toEqual(200)
    expect(body).toHaveProperty('pageCount')
  })
})

describe('Student session creation', () => {
  it('should be possible to create', async () => {
    const { email } = await studentRepository.create(mockStudentData())

    const { status, body } = await supertest(app.server)
      .post('/students/session')
      .send({ email })

    expect(status).toEqual(200)
    expect(body).toHaveProperty('student')
    expect(body).toHaveProperty('token')
  })
})

describe('Student update', () => {
  it('should be possible to update', async () => {
    const { id: studentId } = await studentRepository.create(mockStudentData())

    const name = faker.person.firstName() + ' ' + faker.person.lastName()
    const sessionCredential = generateSessionCredential('student', studentId)

    const { status, body } = await supertest(app.server)
      .patch(`/students/${studentId}`)
      .set('Authorization', sessionCredential)
      .send({ name })

    expect(status).toEqual(200)
    expect(body.student).toHaveProperty('id')
    expect(body.student).toHaveProperty('name')
    expect(body.student).toHaveProperty('email')
    expect(body.student).toHaveProperty('avatar')
    expect(body.student).toHaveProperty('isPaying')
  })
})

describe('Student avatar upload', () => {
  const avatar = '/tmp/student.png'

  beforeAll(() => {
    writeFileSync(avatar, faker.lorem.words())
  })

  afterAll(() => {
    rmSync(avatar)
  })

  it('should be possible to upload', async () => {
    const { id: instructorId } = await studentRepository.create(mockStudentData())

    const sessionCredential = generateSessionCredential('student', instructorId)

    return new Promise<void>((resolve) => {
      supertest(app.server)
        .put(`/students/${instructorId}/avatar`)
        .set('Authorization', sessionCredential)
        .attach('avatar', avatar)
        .then(({ status, body }) => {
          expect(status).toEqual(200)
          expect(body.student).toHaveProperty('id')
          expect(body.student).toHaveProperty('name')
          expect(body.student).toHaveProperty('email')
          expect(body.student).toHaveProperty('avatar')
          expect(body.student).toHaveProperty('isPaying')
        })
        .then(() => {
          backgroundJob.listenJobEvent('completed', resolve)
        })
    })
  })
})
