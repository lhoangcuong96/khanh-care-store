import prisma from '@/database'
import { CreateNewsBodyType } from '@/schemaValidations/admin/admin-news-schema'
import { slugify } from '@/utils/helpers'

export class AdminNewsService {
  async create(data: CreateNewsBodyType): Promise<void> {
    const {
      title,
      summary,
      content,
      image,
      author,
      tags,
      isPublished,
      isFeatured,
      metaTitle,
      metaDescription,
      metaKeywords
    } = data
    const slug = slugify(title)

    // Check if news with same title or slug exists
    const newsExist = await prisma.news.findFirst({
      where: {
        OR: [{ title }, { slug }]
      }
    })

    if (newsExist) {
      throw new Error('Tin tức với tiêu đề hoặc slug này đã tồn tại')
    }

    // Create news
    await prisma.news.create({
      data: {
        title,
        slug,
        summary,
        content,
        image,
        author,
        tags,
        isPublished,
        isFeatured,
        metaTitle,
        metaDescription,
        metaKeywords: metaKeywords || undefined,
        publishedAt: isPublished ? new Date() : null
      }
    })
  }
}
