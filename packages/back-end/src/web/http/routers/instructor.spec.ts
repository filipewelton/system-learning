import { faker } from '@faker-js/faker'
import { rmSync, writeFileSync } from 'fs'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { generateSessionCredential } from '__application/libs/session-credential-generation'
import { FirebaseCloudStorageRepository } from '__data/repositories/cloud-storage/firebase'
import { PostgresInstructorRepository } from '__data/repositories/instructor/postgresql'
import { mockInstructorData } from '__mocks/instructor'
import { BullBackgroundJobProvider } from '__providers/bull-background-jobs'
import { cache } from '__providers/cache'
import { FirebaseCloudStorageProvider } from '__providers/firebase-cloud-storage'

import { app } from '../app'

let instructorRepository: PostgresInstructorRepository
let cloudStorageProvider: FirebaseCloudStorageProvider
let cloudStorageRepository: FirebaseCloudStorageRepository
let backgroundJob: BullBackgroundJobProvider

beforeAll(async () => {
  await app.ready()

  instructorRepository = new PostgresInstructorRepository()
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

describe('Instructor creation', () => {
  it('should be possible to create', async () => {
    const data = mockInstructorData()

    const { status } = await supertest(app.server)
      .post('/instructors')
      .send(data)

    expect(status).toEqual(204)
  })
})

describe('Instructor session creation', () => {
  it('should be possible to create', async () => {
    const { email } = await instructorRepository.create(mockInstructorData())

    const { status, body } = await supertest(app.server)
      .post('/instructors/session')
      .send({ email })

    expect(status).toEqual(200)
    expect(body).toHaveProperty('instructor')
    expect(body).toHaveProperty('token')
  })
})

describe('Instructor listing', () => {
  beforeAll(async () => {
    const data = Array.from(new Array(3)).map(() => mockInstructorData())

    for await (const d of data) {
      await instructorRepository.create(d)
    }
  })

  it('should be possible to get the first page', async () => {
    const { status, body } = await supertest(app.server).get(
      '/instructors?page=1',
    )

    expect(status).toEqual(200)
    expect(body.instructors.length).toBeGreaterThanOrEqual(2)
  })
})

describe('Instructor update', () => {
  it('should be possible to update', async () => {
    const { id: instructorId } =
      await instructorRepository.create(mockInstructorData())

    const bio = faker.lorem.words()
    const sessionCredential = generateSessionCredential('instructor', instructorId)

    const { status, body } = await supertest(app.server)
      .patch(`/instructors/${instructorId}`)
      .set('Authorization', sessionCredential)
      .send({ bio })

    expect(status).toEqual(200)
    expect(body.instructor).toHaveProperty('id')
    expect(body.instructor).toHaveProperty('name')
    expect(body.instructor).toHaveProperty('email')
    expect(body.instructor).toHaveProperty('avatar')
    expect(body.instructor).toHaveProperty('bio')
  })
})

describe('Instructor avatar upload', () => {
  const avatar = '/tmp/instructor.png'

  beforeAll(() => {
    writeFileSync(avatar, faker.lorem.words())
  })

  afterAll(() => {
    rmSync(avatar)
  })

  it('should be possible to upload', async () => {
    const { id: instructorId } =
      await instructorRepository.create(mockInstructorData())

    const sessionCredential = generateSessionCredential('instructor', instructorId)

    return new Promise<void>((resolve) => {
      supertest(app.server)
        .put(`/instructors/${instructorId}/avatar`)
        .set('Authorization', sessionCredential)
        .attach('avatar', avatar)
        .then(({ status, body }) => {
          expect(status).toEqual(200)
          expect(body.instructor).toHaveProperty('id')
          expect(body.instructor).toHaveProperty('name')
          expect(body.instructor).toHaveProperty('email')
          expect(body.instructor).toHaveProperty('avatar')
          expect(body.instructor).toHaveProperty('bio')
        })
        .then(() => {
          backgroundJob.listenJobEvent('completed', resolve)
        })
    })
  })
})

describe('Instructor search by id', () => {
  it('should be possible to find', async () => {
    const { id } = await instructorRepository.create(mockInstructorData())
    const { status, body } = await supertest(app.server).get(
      `/instructors/${id}`,
    )

    expect(status).toEqual(200)
    expect(body.instructor).toHaveProperty('id')
    expect(body.instructor).toHaveProperty('name')
    expect(body.instructor).toHaveProperty('email')
    expect(body.instructor).toHaveProperty('avatar')
    expect(body.instructor).toHaveProperty('bio')
  })
})

describe('Getting result page count', () => {
  it('should be possible to get', async () => {
    const { status, body } = await supertest(app.server).get(
      '/instructors/count',
    )

    expect(status).toEqual(200)
    expect(body).toHaveProperty('pageCount')
  })
})

describe('Instructor search by name', () => {
  it('should be possible to find matches', async () => {
    await instructorRepository.create({
      ...mockInstructorData(),
      name: 'John Doe',
    })
    await instructorRepository.create({
      ...mockInstructorData(),
      name: 'Jane Doe',
    })

    const { status, body } = await supertest(app.server).get(
      `/instructors/search?name=Doe&page=1`,
    )

    expect(status).toEqual(200)
    expect(body.instructors.length).toBeGreaterThanOrEqual(2)
  })
})
