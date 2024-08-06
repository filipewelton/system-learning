import { EventEmitter } from 'node:events'

import {
  BackgroundJobProvider,
  EventListener,
  JobEvents,
  ProcessHandler,
  Queue,
} from '__application/interfaces/background-jobs'
import { CLOUD_STORAGE_UPLOAD_QUEUE } from '__domain/constants/background-jobs'

export class FakeBackgroundJobProvider implements BackgroundJobProvider {
  private static queues: Map<string, Queue>
  private static events: EventEmitter

  constructor() {
    if (!FakeBackgroundJobProvider.queues) {
      FakeBackgroundJobProvider.queues = new Map<string, Queue>()
    }

    if (!FakeBackgroundJobProvider.events) {
      FakeBackgroundJobProvider.events = new EventEmitter()
    }

    const handler: ProcessHandler = async () => {
      this.emitJobEvent('completed')
    }

    this.createQueue(CLOUD_STORAGE_UPLOAD_QUEUE, handler)
  }

  createQueue(queueName: string, handler: ProcessHandler): void {
    const queue: Queue = {
      name: queueName,
      async add(data) {
        handler({ data })
      },
      async process() {},
    }

    FakeBackgroundJobProvider.queues.set(queueName, queue)
  }

  getQueue(queueName: string): Queue | undefined {
    return FakeBackgroundJobProvider.queues.get(queueName)
  }

  emitJobEvent(event: JobEvents, error?: Error): void {
    FakeBackgroundJobProvider.events.emit(event, error)
  }

  listenJobEvent(event: JobEvents, listener: EventListener): void {
    FakeBackgroundJobProvider.events.on(event, listener)
  }
}
