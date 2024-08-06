import { FastifyReply, FastifyRequest } from 'fastify'

import { InstructorFactory } from '__application/factories/instructor'
import { CloudStorageUploadRepository } from '__data/repositories/background-jobs/cloud-storage-upload'
import { FirebaseCloudStorageRepository } from '__data/repositories/cloud-storage/firebase'
import { PostgresInstructorRepository } from '__data/repositories/instructor/postgresql'
import { RedisResultPageCountRepository } from '__data/repositories/result-page-count/redis'
import { BullBackgroundJobProvider } from '__providers/bull-background-jobs'
import { FirebaseCloudStorageProvider } from '__providers/firebase-cloud-storage'

const cloudStorageProvider = new FirebaseCloudStorageProvider()
const instructorRepository = new PostgresInstructorRepository()

const cloudStorageRepository = new FirebaseCloudStorageRepository(
  cloudStorageProvider,
)

const backgroundJobProvider = new BullBackgroundJobProvider(
  cloudStorageRepository,
)

const uploadRepository = new CloudStorageUploadRepository(backgroundJobProvider)
const factory = new InstructorFactory()
const resultPageCountRepository = new RedisResultPageCountRepository()

export async function create(req: FastifyRequest, res: FastifyReply) {
  await factory.create({
    instructorRepository,
    resultPageCountRepository,
    body: req.body,
  })

  res.status(204).send()
}

export async function createSession(req: FastifyRequest, res: FastifyReply) {
  const response = await factory.createSession({
    instructorRepository,
    body: req.body,
  })

  res.status(200).send(response)
}

export async function findAll(req: FastifyRequest, res: FastifyReply) {
  const response = await factory.findAll({
    instructorRepository,
    routeQuery: req.query,
  })

  res.status(200).send(response)
}

export async function update(req: FastifyRequest, res: FastifyReply) {
  const response = await factory.update({
    instructorRepository,
    routeParams: req.params,
    body: req.body,
    instructor: req.user,
  })

  res.status(200).send(response)
}

export async function uploadAvatar(req: FastifyRequest, res: FastifyReply) {
  const response = await factory.uploadAvatar({
    instructorRepository,
    uploadRepository,
    routeParams: req.params,
    file: req.file(),
    instructor: req.user,
  })

  res.status(200).send(response)
}

export async function findById(req: FastifyRequest, res: FastifyReply) {
  const response = await factory.findById({
    instructorRepository,
    routeParams: req.params,
  })

  res.status(200).send(response)
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

export async function findByName(req: FastifyRequest, res: FastifyReply) {
  const response = await factory.findByName({
    instructorRepository,
    routeQuery: req.query,
  })

  res.status(200).send(response)
}
