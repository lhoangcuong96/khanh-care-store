import { CreateNewsBodyType, NewsInListType, NewsListQueryType } from '@/schemaValidations/admin/admin-news-schema'
import { Order } from '@/schemaValidations/common.schema'
import { AdminNewsService } from '@/services/admin/admin-news.service'

export default class AdminNewsController {
  service: AdminNewsService

  constructor() {
    this.service = new AdminNewsService()
  }

  createNews = (data: CreateNewsBodyType): Promise<void> => {
    return this.service.create(data)
  }

  getNewsList = (params: NewsListQueryType): Promise<{ data: NewsInListType[]; total: number }> => {
    return this.service.list(params)
  }
}
