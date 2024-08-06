import { Writable } from 'node:stream'

export type FileUpload = {
  fileContent: string
  directory: 'public' | 'courses'
  fileName: string
}

export type FileDeletion = {
  storageRef: string
}

export interface CloudStorageProvider {
  createStream(url: string): Writable
  delete(storageRef: string): Promise<void>
}

export interface CloudStorageRepository {
  upload(params: FileUpload): Promise<void>
  delete(params: FileDeletion): Promise<void>
}
