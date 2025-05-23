import prisma from '@/database'
import { Order } from '@/schemaValidations/common.schema'
import { ProductInListType, ProductListQueryType } from '@/schemaValidations/product.schema'
import { Prisma } from '@prisma/client'

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

  async list(queryParams: ProductListQueryType): Promise<{ data: ProductInListType[] }> {
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
      return { price: { gte: min, lte: max } }
    })

    const listWeight = weight ? decodeURIComponent(weight).split(',') : []
    const weightFilters = listWeight.map((weight) => {
      return {
        attributes: {
          some: {
            key: 'weight',
            value: { equals: weight }
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
    const where: Prisma.ProductWhereInput = {
      AND: [
        categoryId
          ? {
              category: {
                id: categoryId
              }
            }
          : {},
        search ? { name: { contains: search, mode: Prisma.QueryMode.insensitive } } : {},
        isPromotion ? { isPromotion: true } : {},
        isBestSeller ? { isBestSeller: true } : {},
        isFeatured ? { isFeatured: true } : {},
        {
          isPublished: true
        }
      ],
      OR:
        priceFilters.length || weightFilters.length
          ? [...(priceFilters.length ? priceFilters : []), ...(weightFilters.length ? weightFilters : [])]
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
      image: true
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
    return { data }
  }

  async getDetailBySlug(slug: string) {
    const data = await prisma.product.findFirstOrThrow({
      where: {
        slug
      },
      select: {
        id: true,
        name: true,
        price: true,
        slug: true,
        description: true,
        title: true,
        stock: true,
        sold: true,
        isBestSeller: true,
        isFeatured: true,
        isPromotion: true,
        promotionPercent: true,
        promotionStart: true,
        promotionEnd: true,
        categoryId: true,
        image: true,
        attributes: true,
        variants: true
      }
    })
    return data
  }
}
