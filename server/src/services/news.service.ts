import prisma from '@/database'
import { NewsInListType, NewsListQueryType, NewsSchemaType } from '@/schemaValidations/news.schema'
import { Prisma } from '@prisma/client'

export class PublicNewsService {
  async list(params: NewsListQueryType): Promise<{
    data: NewsInListType[]
    totalPages: number
    total: number
    limit: number
    currentPage: number
    totalItems: number
  }> {
    const { page = 1, limit = 20, search } = params
    const skip = (page - 1) * limit
    const take = limit

    const where: Prisma.NewsWhereInput = {
      AND: [
        { isPublished: true }, // Only show published news
        search
          ? {
              OR: [
                { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
                { summary: { contains: search, mode: Prisma.QueryMode.insensitive } },
                { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
                { author: { contains: search, mode: Prisma.QueryMode.insensitive } },
                { tags: { has: search } }
              ]
            }
          : {}
      ]
    }

    const [data, total] = await Promise.all([
      prisma.news.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          image: true,
          author: true,
          tags: true,
          isFeatured: true,
          viewCount: true,
          createdAt: true
        }
      }),
      prisma.news.count({ where })
    ])

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      limit,
      currentPage: page,
      totalItems: total
    }
  }

  async getNewsDetails(slug: string): Promise<NewsSchemaType | null> {
    const news = await prisma.news.findFirst({
      where: {
        slug,
        isPublished: true
      },
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        content: true,
        image: true,
        author: true,
        tags: true,
        isFeatured: true,
        isPublished: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
        metaTitle: true,
        metaDescription: true,
        metaKeywords: true
      }
    })

    if (news) {
      // Increment view count
      await prisma.news.update({
        where: { id: news.id },
        data: { viewCount: { increment: 1 } }
      })
    }

    return news
  }
}
