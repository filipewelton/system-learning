import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

import {
  CloudStorageRepository,
  FileDeletion,
  FileUpload,
} from '__application/interfaces/cloud-storage'
import { FirebaseCloudStorageProvider } from '__providers/firebase-cloud-storage'

export class FirebaseCloudStorageRepository implements CloudStorageRepository {
  constructor(
    private firebaseCloudStorageProvider: FirebaseCloudStorageProvider,
  ) {}

  async upload(params: FileUpload): Promise<void> {
    const { fileContent, directory, fileName } = params
    const url = `${directory}/${fileName}`
    const writer = this.firebaseCloudStorageProvider.createStream(url)
    const pump = promisify(pipeline)

    await pump(fileContent, writer)
  }

  async delete(params: FileDeletion): Promise<void> {
    const { storageRef } = params
    const parsedRef = storageRef.replace(/^\//, '')

    await this.firebaseCloudStorageProvider.delete(parsedRef)
  }
}
