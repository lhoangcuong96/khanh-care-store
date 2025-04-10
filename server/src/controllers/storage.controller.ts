import { S3StorageService, StorageContext, StorageService } from '@/services/storage.service'

export default class StorageController {
  service
  constructor() {
    this.service = new StorageContext(new S3StorageService())
  }
  generatePresignedUrl(fileName: string, fileType: string) {
    return this.service.generatePresignedUrl(fileName, fileType)
  }
}
