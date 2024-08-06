import { FileUpload } from './cloud-storage'

interface Job {
  data: unknown
}

export type ProcessHandler = (job: Job) => Promise<void>

export interface BackgroundJobRepository {
  call(params: FileUpload): Promise<void>
}

export type EventListener = () => void

export type JobEvents = 'completed' | 'failed'

export interface Queue {
  name: string
  process: ProcessHandler
  add: (data: unknown, options?: unknown) => Promise<void>
}

export interface BackgroundJobProvider {
  createQueue(queueName: string, handler: ProcessHandler): void
  getQueue(queueName: string): Queue | undefined
  emitJobEvent(event: JobEvents, error?: Error): void
  listenJobEvent(event: JobEvents, listener: EventListener): void
}
