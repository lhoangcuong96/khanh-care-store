import { CreateNewsBodyType } from '@/schemaValidations/news.schema'
import { AdminNewsService } from '@/services/admin/admin-news.service'

export default class AdminNewsController {
  service: AdminNewsService

  constructor() {
    this.service = new AdminNewsService()
  }

  createNews = (data: CreateNewsBodyType): Promise<void> => {
    return this.service.create(data)
  }
}
