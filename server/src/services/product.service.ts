import prisma from '@/database'
import { Order } from '@/schemaValidations/common.schema'
import { ProductListQueryType, ProductInListType } from '@/schemaValidations/product.schema'
import { CategoryService } from './category.service'
import { equal } from 'assert'

export class ProductService {
  async checkProductAvailability(productId: string, quantity: number) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        stock: {
          gte: quantity
        }
      }
    })
    if (!product) {
      throw new Error('Product is not available')
    }
    return product
  }

  async list(queryParams: ProductListQueryType): Promise<ProductInListType[]> {
    const {
      page = 1,
      limit = 20,
      category,
      sort = 'createdAt',
      order = Order.Desc,
      search,
      isPromotion = false,
      isBestSeller = false,
      isFeatured = false,
      price,
      weight
    } = queryParams
    const skip = (page - 1) * limit
    const take = limit

    const priceRanges = price ? decodeURIComponent(price).split(',') : []
    const priceFilters = priceRanges.map((range) => {
      const [min, max] = range.split('-').map(Number)
      return { price: { gte: min, lte: max } } // Prisma expects `gte` and `lte`
    })

    const listWeight = weight ? decodeURIComponent(weight).split(',') : []
    const weightFilters = listWeight.map((weight) => {
      return {
        attributes: {
          some: {
            key: 'weight',
            value: weight
          }
        }
      }
    })

    const categoryObj = category
      ? await prisma.category.findFirst({
          where: {
            slug: category
          },
          select: {
            id: true
          }
        })
      : undefined
    const categoryId = categoryObj?.id
    const where = {
      AND: [
        categoryId
          ? {
              category: {
                id: categoryId
              }
            }
          : {},
        search ? { name: { contains: search, mode: 'insensitive' } } : {},
        isPromotion ? { isPromotion: true } : {},
        isBestSeller ? { isBestSeller: true } : {},
        isFeatured ? { isFeatured: true } : {}
      ],
      OR:
        priceFilters.length || weightFilters.length
          ? [
              ...(priceFilters.length ? priceFilters : []),
              {
                attributes: {
                  equals: { weight: 500, origin: 'Việt Nam' }
                }
              }
            ]
          : undefined
    }
    const select = {
      id: true,
      name: true,
      price: true,
      slug: true,
      description: true,
      title: true,
      stock: true,
      isBestSeller: true,
      isFeatured: true,
      isPromotion: true,
      promotionPercent: true,
      promotionStart: true,
      promotionEnd: true,
      image: {
        select: {
          thumbnail: true
        }
      }
    }
    let orderBy: { [x: string]: string } = {
      createdAt: 'desc'
    }
    if (sort) {
      orderBy = {
        [sort]: order === Order.Asc ? 'asc' : 'desc'
      }
    }

    const data = await prisma.product.findMany({
      where,
      skip,
      take,
      orderBy,
      select
    })
    return data
  }

  async getDetailBySlug(slug: string) {
    return prisma.product.findFirstOrThrow({
      where: {
        slug
      }
    })
  }
}
