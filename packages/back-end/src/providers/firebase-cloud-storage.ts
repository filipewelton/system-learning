import admin from 'firebase-admin'
import { cert } from 'firebase-admin/app'
import { Writable } from 'stream'

import { CloudStorageProvider } from '__application/interfaces/cloud-storage'
import { env } from '__configs/environment'

export class FirebaseCloudStorageProvider implements CloudStorageProvider {
  private static app: admin.app.App
  static storage: admin.storage.Storage

  constructor() {
    if (!FirebaseCloudStorageProvider.app) {
      const app = admin.initializeApp({
        credential: cert({
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey: env.FIREBASE_PRIVATE_KEY,
          projectId: env.FIREBASE_PROJECT_ID,
        }),
        storageBucket: env.FIREBASE_STORAGE_BUCKET,
      })

      FirebaseCloudStorageProvider.app = app
    }

    if (!FirebaseCloudStorageProvider.storage) {
      const storage =
        FirebaseCloudStorageProvider.storage ??
        admin.storage(FirebaseCloudStorageProvider.app)

      FirebaseCloudStorageProvider.storage = storage
    }
  }

  createStream(url: string): Writable {
    return FirebaseCloudStorageProvider.storage
      .bucket()
      .file(url)
      .createWriteStream()
  }

  async delete(storageRef: string): Promise<void> {
    await FirebaseCloudStorageProvider.storage
      .bucket()
      .file(storageRef)
      .delete({ ignoreNotFound: true })
  }
}
