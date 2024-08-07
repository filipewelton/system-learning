import { FastifyReply, FastifyRequest } from 'fastify'

import { StudentFactory } from '__application/factories/student'
import { CloudStorageUploadRepository } from '__data/repositories/background-jobs/cloud-storage-upload'
import { FirebaseCloudStorageRepository } from '__data/repositories/cloud-storage/firebase'
import { RedisResultPageCountRepository } from '__data/repositories/result-page-count/redis'
import { PostgresStudentRepository } from '__data/repositories/student/postgres'
import { Student } from '__data/schemas/student'
import { BullBackgroundJobProvider } from '__providers/bull-background-jobs'
import { FirebaseCloudStorageProvider } from '__providers/firebase-cloud-storage'

const factory = new StudentFactory()
const studentRepository = new PostgresStudentRepository()
const resultPageCountRepository = new RedisResultPageCountRepository()
const cloudStorageProvider = new FirebaseCloudStorageProvider()

const cloudStorageRepository = new FirebaseCloudStorageRepository(
  cloudStorageProvider,
)

const backgroundJobProvider = new BullBackgroundJobProvider(
  cloudStorageRepository,
)

const uploadRepository = new CloudStorageUploadRepository(backgroundJobProvider)

export async function createStudent(req: FastifyRequest, res: FastifyReply) {
  await factory.create({
    studentRepository,
    resultPageCountRepository,
    body: req.body,
  })

  res.status(204).send()
}

export async function getResultPageCount(
  _req: FastifyRequest,
  res: FastifyReply,
) {
  const response = await factory.getResultPageCount({
    resultPageCountRepository,
  })

  res.status(200).send(response)
}

export async function createSession(req: FastifyRequest, res: FastifyReply) {
  const response = await factory.createSession({
    studentRepository,
    body: req.body,
  })

  res.status(200).send(response)
}

export async function update(req: FastifyRequest, res: FastifyReply) {
  const response = await factory.update({
    studentRepository,
    routeParams: req.params,
    body: req.body,
    student: req.user as Student,
  })

  res.status(200).send(response)
}

export async function uploadAvatar(req: FastifyRequest, res: FastifyReply) {
  const response = await factory.uploadAvatar({
    studentRepository,
    uploadRepository,
    routeParams: req.params,
    file: req.file(),
    student: req.user as Student,
  })

  res.status(200).send(response)
}
