import prisma from '@/database'
import { NewsInListType, NewsListQueryType } from '@/schemaValidations/admin/admin-news-schema'
import { Order } from '@/schemaValidations/common.schema'
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
    const { page = 1, limit = 20, sort = 'publishedAt', order = Order.Desc, search, isFeatured } = params
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
          : {},
        isFeatured !== undefined ? { isFeatured } : {}
      ]
    }

    const [data, total] = await Promise.all([
      prisma.news.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sort]: order === Order.Asc ? 'asc' : 'desc'
        },
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          image: true,
          author: true,
          tags: true,
          isPublished: true,
          isFeatured: true,
          viewCount: true,
          createdAt: true,
          publishedAt: true
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
}
