import { CloudStorageRepository } from '__application/interfaces/cloud-storage'

export class FakeCloudStorageRepository implements CloudStorageRepository {
  async upload(): Promise<void> {}
  async delete(): Promise<void> {}
}
