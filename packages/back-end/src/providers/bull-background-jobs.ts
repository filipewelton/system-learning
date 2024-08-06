import Bull, { QueueOptions } from 'bull'
import { EventEmitter } from 'node:events'

import { CodingException } from '__application/exceptions/coding'
import {
  BackgroundJobProvider,
  EventListener,
  JobEvents,
  ProcessHandler,
  Queue,
} from '__application/interfaces/background-jobs'
import { FileUpload } from '__application/interfaces/cloud-storage'
import { env } from '__configs/environment'
import { FirebaseCloudStorageRepository } from '__data/repositories/cloud-storage/firebase'
import { CLOUD_STORAGE_UPLOAD_QUEUE } from '__domain/constants/background-jobs'

const defaultQueueOptions: QueueOptions = { redis: env.CACHE_URI }

const cloudStorageUploadQueue = new Bull(
  CLOUD_STORAGE_UPLOAD_QUEUE,
  defaultQueueOptions,
)

export class BullBackgroundJobProvider implements BackgroundJobProvider {
  private static queues: Map<string, Queue>
  private static events: EventEmitter

  constructor(cloudStorageRepository: FirebaseCloudStorageRepository) {
    if (!BullBackgroundJobProvider.queues) {
      BullBackgroundJobProvider.queues = new Map<string, Queue>()
    }

    if (!BullBackgroundJobProvider.events) {
      BullBackgroundJobProvider.events = new EventEmitter()
    }

    this.configureCloudStorageUploadQueue(cloudStorageRepository)
  }

  createQueue(queueName: string, handler: ProcessHandler): void {
    const queue =
      queueName === CLOUD_STORAGE_UPLOAD_QUEUE ? cloudStorageUploadQueue : null

    if (!queue) {
      throw new CodingException('Queue is missing')
    }

    queue.process(handler)

    BullBackgroundJobProvider.queues.set(queueName, {
      async add(data) {
        queue.add(data)
      },
      name: queue.name,
      async process(job) {
        handler(job)
      },
    })
  }

  private configureCloudStorageUploadQueue(
    cloudStorageRepository: FirebaseCloudStorageRepository,
  ) {
    const queue = this.getQueue(CLOUD_STORAGE_UPLOAD_QUEUE)

    if (queue) return

    const handler: ProcessHandler = async (job) => {
      const { data } = job

      await cloudStorageRepository
        .upload(data as FileUpload)
        .then(() => this.emitJobEvent('completed'))
        .catch((error) => this.emitJobEvent('failed', error))
    }

    this.createQueue(CLOUD_STORAGE_UPLOAD_QUEUE, handler)
  }

  getQueue(queueName: string): Queue | undefined {
    return BullBackgroundJobProvider.queues.get(queueName)
  }

  emitJobEvent(event: JobEvents, error?: Error): void {
    BullBackgroundJobProvider.events.emit(event, error)
  }

  listenJobEvent(event: JobEvents, listener: EventListener): void {
    BullBackgroundJobProvider.events.on(event, listener)
  }
}
