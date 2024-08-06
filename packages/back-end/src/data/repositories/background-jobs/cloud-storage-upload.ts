import {
  BackgroundJobProvider,
  BackgroundJobRepository,
} from '__application/interfaces/background-jobs'
import { FileUpload } from '__application/interfaces/cloud-storage'
import { CLOUD_STORAGE_UPLOAD_QUEUE } from '__domain/constants/background-jobs'

export class CloudStorageUploadRepository implements BackgroundJobRepository {
  constructor(private backgroundJobProvider: BackgroundJobProvider) {}

  async call(params: FileUpload): Promise<void> {
    const queue = this.backgroundJobProvider.getQueue(
      CLOUD_STORAGE_UPLOAD_QUEUE,
    )

    await queue?.add(params, {
      attempts: 3,
      delay: 1000,
      removeOnComplete: true,
      removeOnFail: true,
    })
  }
}
