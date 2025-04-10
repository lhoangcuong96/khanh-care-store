import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export interface StorageService {
  generatePresignedUrl(fileName: string, fileType: string): Promise<{ presignedUrl: string; fileUrl: string }>

  delete(): void
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_KEY!
  }
})
export class S3StorageService implements StorageService {
  async generatePresignedUrl(fileName: string, fileType: string): Promise<{ presignedUrl: string; fileUrl: string }> {
    const key = fileName
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      ContentType: encodeURI(fileType)
    })
    try {
      const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600
      })
      // Encode key nếu như key có ký tự đặc biệt sẽ bị sai so với s3
      const fileUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
      return { presignedUrl, fileUrl }
    } catch (error) {
      console.error(error)
      throw new Error('Error generating presigned URL')
    }
  }
  delete() {}
}

// export class GCPStorageService implements StorageService {
//   upload() {}
//   delete() {}
// }

export class StorageContext {
  service: StorageService
  constructor(service: StorageService) {
    this.service = service
  }

  async generatePresignedUrl(fileName: string, fileType: string) {
    return this.service.generatePresignedUrl(fileName, fileType)
  }

  async deleteFile() {}
}
