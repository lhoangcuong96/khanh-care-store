import prisma from '@/database'
import { Order } from '@/schemaValidations/common.schema'
import { ProductInListType, ProductListQueryType } from '@/schemaValidations/product.schema'
import { Prisma } from '@prisma/client'
import { removeVietnameseAccents } from '@/utils/string.utils'

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

  async list(queryParams: ProductListQueryType): Promise<{
    data: ProductInListType[]
    total: number
    limit: number
    page: number
    totalPages: number
  }> {
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
      isFavorite = false,
      accountId
    } = queryParams
    const skip = (page - 1) * limit
    const take = limit

    let favoriteProducts: string[] = []
    if (isFavorite && accountId) {
      const accounts = await prisma.account.findFirst({
        where: {
          id: accountId
        },
        select: {
          favoriteProducts: {
            select: {
              id: true
            }
          }
        }
      })
      favoriteProducts = accounts?.favoriteProducts.map((product) => product.id) || []
    }

    const where: Prisma.ProductWhereInput = {
      AND: [
        category
          ? {
              category: {
                id: category
              }
            }
          : {},
        search
          ? {
              OR: [
                { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
                { name: { contains: removeVietnameseAccents(search), mode: Prisma.QueryMode.insensitive } }
              ]
            }
          : {},
        isPromotion ? { isPromotion: true } : {},
        isBestSeller ? { isBestSeller: true } : {},
        isFeatured ? { isFeatured: true } : {},
        {
          isPublished: true
        },
        favoriteProducts.length > 0 ? { id: { in: favoriteProducts } } : {}
      ]
    }

    const select: Prisma.ProductSelect = {
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
      image: true,
      variants: {
        select: {
          id: true,
          name: true,
          price: true,
          stock: true
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

    const getProducts = prisma.product.findMany({
      where,
      skip,
      take,
      orderBy,
      select
    })

    const getTotal = prisma.product.count({
      where
    })

    const [data, total] = await Promise.all([getProducts, getTotal])
    return {
      data: data.map((product) => ({
        ...product,
        isFavorite: favoriteProducts.includes(product.id)
      })),
      total,
      limit,
      page,
      totalPages: Math.ceil(total / limit)
    }
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

  async getRelatedProducts(
    productId: string,
    limit: number = 4,
    page: number = 1
  ): Promise<{
    data: ProductInListType[]
    total: number
    limit: number
    page: number
    totalPages: number
  }> {
    try {
      // First get the product to find its category
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { categoryId: true }
      })

      if (!product) {
        throw new Error('Không tìm thấy sản phẩm')
      }

      // Get products from the same category, excluding the current product
      const getRelativeProducts = prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: productId },
          isPublished: true
        },
        take: limit,
        select: {
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
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      const getTotalProducts = prisma.product.count({
        where: {
          categoryId: product.categoryId,
          id: { not: productId },
          isPublished: true
        }
      })
      const [relativeProducts, totalProducts] = await Promise.all([getRelativeProducts, getTotalProducts])
      const totalPages = Math.ceil(totalProducts / limit)

      return {
        data: relativeProducts,
        total: totalProducts,
        limit,
        page,
        totalPages
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`)
      }
      throw error
    }
  }
}
