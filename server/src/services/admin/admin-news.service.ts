import prisma from '@/database'
import { CreateNewsBodyType, NewsInListType, NewsListQueryType } from '@/schemaValidations/admin/admin-news-schema'
import { slugify } from '@/utils/helpers'
import { Order } from '@/schemaValidations/common.schema'
import { Prisma } from '@prisma/client'

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
      metaKeywords,
      slug
    } = data

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

  async list(params: NewsListQueryType): Promise<{
    data: NewsInListType[]
    totalPages: number
    total: number
    limit: number
    currentPage: number
    totalItems: number
  }> {
    const { page = 1, limit = 20, sort = 'createdAt', order = Order.Desc, search, isPublished, isFeatured } = params
    const skip = (page - 1) * limit
    const take = limit

    console.log('isPublished', isPublished, isFeatured)

    const where: Prisma.NewsWhereInput = {
      AND: [
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
        isPublished !== undefined ? { isPublished } : {},
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
