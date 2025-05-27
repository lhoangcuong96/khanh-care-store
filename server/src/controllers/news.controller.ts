import { NewsListQueryType } from '@/schemaValidations/admin/admin-news-schema'
import { PublicNewsService } from '@/services/news.service'

export default class NewsController {
  service: PublicNewsService

  constructor() {
    this.service = new PublicNewsService()
  }

  getNewsList = (params: NewsListQueryType) => {
    return this.service.list(params)
  }

  getNewsDetails = (slug: string) => {
    return this.service.getNewsDetails(slug)
  }
}
