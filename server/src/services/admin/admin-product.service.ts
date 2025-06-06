import prisma from '@/database'
import {
  CreateProductBodyType,
  ProductDetailType,
  ProductInListType,
  ProductListQueryType,
  ProductType,
  UpdateProductBodyType
} from '@/schemaValidations/admin/admin-product-schema'
import { Order } from '@/schemaValidations/common.schema'
import { slugify } from '@/utils/helpers'
import { Prisma } from '@prisma/client'

export class AdminProductService {
  async create(data: CreateProductBodyType): Promise<void> {
    try {
      const { categoryId, attributes, variants, ...rest } = data
      const slug = slugify(rest.name)

      const productAttributes = Object.keys(data.attributes || {}).map((key) => {
        return {
          key,
          value: data.attributes?.[key]
        }
      })

      await prisma.$transaction(async (tx) => {
        const createdProduct = await tx.product.create({
          data: {
            ...rest,
            slug,
            image: {
              ...rest.image,
              gallery: rest.image.gallery || []
            },
            category: {
              connect: {
                id: categoryId
              }
            }
          }
        })

        /* Create product attributes*/
        if (productAttributes.length > 0) {
          await tx.productAttributeValue.createMany({
            data: productAttributes.map((attribute) => {
              return {
                productId: createdProduct.id,
                attributeId: attribute.key,
                value: attribute.value || ''
              }
            })
          })
        }

        /* Create product variants and their attributes*/
        if (variants) {
          for (const variant of variants) {
            const createdVariant = await tx.productVariant.create({
              data: {
                productId: createdProduct.id,
                name: variant.name,
                sku: variant.sku,
                price: variant.price,
                stock: variant.stock
              }
            })

            const variantAttributes = Object.keys(variant.attributes || {}).map((key) => {
              return {
                key,
                value: variant.attributes?.[key]
              }
            })

            if (variantAttributes && variantAttributes.length > 0) {
              await tx.productAttributeValue.createMany({
                data: variantAttributes.map((attribute) => {
                  return {
                    attributeId: attribute.key,
                    value: attribute.value || '',
                    variantId: createdVariant.id
                  }
                })
              })
            }
          }
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`)
      }
      throw error
    }
  }

  async list(queryParams: ProductListQueryType): Promise<{
    data: ProductInListType[]
    total: number
    limit: number
    page: number
    totalPages: number
  }> {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        sort = 'createdAt',
        order = Order.Desc,
        search,
        priceFrom,
        priceTo,
        stockStatus = 'all',
        createdFrom,
        createdTo,
        isPublished
      } = queryParams
      const skip = (page - 1) * limit
      const take = limit
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
                  { name: { contains: search, mode: 'insensitive' } },
                  { slug: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                  {
                    variants: {
                      some: {
                        name: { contains: search, mode: 'insensitive' }
                      }
                    }
                  }
                ]
              }
            : {},
          priceFrom !== undefined ? { price: { gte: priceFrom } } : {},
          priceTo !== undefined ? { price: { lte: priceTo } } : {},
          createdFrom ? { createdAt: { gte: createdFrom } } : {},
          createdTo ? { createdAt: { lte: createdTo } } : {},
          stockStatus === 'in_stock'
            ? { stock: { gt: 0 } }
            : stockStatus === 'low_stock'
              ? { stock: { gt: 0, lte: 10 } } // You can adjust the threshold for low stock
              : stockStatus === 'out_of_stock'
                ? { stock: { lte: 0 } }
                : {},
          isPublished !== undefined ? { isPublished: isPublished === 'true' } : {}
        ]
      }

      const select = {
        id: true,
        name: true,
        price: true,
        stock: true,
        slug: true,
        sold: true,
        isPublished: true,
        isFeatured: true,
        isBestSeller: true,
        isPromotion: true,
        promotionPercent: true,
        promotionStart: true,
        promotionEnd: true,
        image: {
          select: {
            thumbnail: true,
            banner: true,
            featured: true,
            gallery: true
          }
        }
      }

      let orderBy: { [x: string]: string } = {
        updatedAt: 'desc'
      }
      // Map UI sort values to Prisma orderBy
      switch (sort) {
        case 'newest':
          orderBy = { updatedAt: 'desc' }
          break
        case 'oldest':
          orderBy = { updatedAt: 'asc' }
          break
        case 'name_asc':
          orderBy = { name: 'asc' }
          break
        case 'name_desc':
          orderBy = { name: 'desc' }
          break
        case 'price_high':
          orderBy = { price: 'desc' }
          break
        case 'price_low':
          orderBy = { price: 'asc' }
          break
        default:
          orderBy = { updatedAt: order === Order.Asc ? 'asc' : 'desc' }
          break
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
        data: data as unknown as ProductInListType[],
        total,
        limit,
        page,
        totalPages: Math.ceil(total / limit)
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`)
      }
      throw error
    }
  }

  async update(id: string, data: UpdateProductBodyType): Promise<Partial<ProductType>> {
    try {
      const { categoryId, variants, attributes, ...rest } = data
      const slug = slugify(rest.name)

      // First check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id },
        include: {
          attributes: true,
          variants: true
        }
      })

      if (!existingProduct) {
        throw new Error('Product not found')
      }

      // Start transaction
      return await prisma.$transaction(async (tx) => {
        // Update basic product info
        const updatedProduct = await tx.product.update({
          where: { id },
          data: {
            ...rest,
            slug,
            image: {
              ...data.image,
              gallery: data.image.gallery || []
            },
            category: {
              connect: {
                id: categoryId
              }
            }
          }
        })

        // Update attributes
        if (attributes) {
          await tx.productAttributeValue.deleteMany({
            where: {
              productId: id
            }
          })
          const productAttributes = Object.entries(attributes).map(([key, value]) => ({
            productId: id,
            attributeId: key,
            value: value || ''
          }))

          if (productAttributes.length > 0) {
            await tx.productAttributeValue.createMany({
              data: productAttributes
            })
          }
        }

        // Update variants
        if (variants) {
          await tx.productVariant.deleteMany({
            where: {
              productId: id
            }
          })
          for (const variant of variants) {
            const createdVariant = await tx.productVariant.create({
              data: {
                productId: updatedProduct.id,
                name: variant.name,
                sku: variant.sku,
                price: variant.price,
                stock: variant.stock
              }
            })

            const variantAttributes = Object.keys(variant.attributes || {}).map((key) => {
              return {
                key,
                value: variant.attributes?.[key]
              }
            })

            if (variantAttributes && variantAttributes.length > 0) {
              await tx.productAttributeValue.createMany({
                data: variantAttributes.map((attribute) => {
                  return {
                    attributeId: attribute.key,
                    value: attribute.value || '',
                    variantId: createdVariant.id
                  }
                })
              })
            }
          }
        }

        return updatedProduct as Partial<ProductType>
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`)
      }
      throw error
    }
  }

  async delete(ids: string[]) {
    try {
      await prisma.product.deleteMany({
        where: {
          id: {
            in: ids
          }
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`)
      }
      throw error
    }
  }

  async getDetailBySlug(slug: string) {
    try {
      const product = await prisma.product.findFirstOrThrow({
        where: {
          slug
        },
        select: {
          id: true,
          name: true,
          title: true,
          price: true,
          description: true,
          slug: true,
          stock: true,
          image: true,
          categoryId: true,
          tags: true,
          isFeatured: true,
          isBestSeller: true,
          attributes: true,
          variants: {
            select: {
              id: true,
              name: true,
              sku: true,
              price: true,
              stock: true,
              attributes: {
                select: {
                  attributeId: true,
                  value: true
                }
              }
            }
          }
        }
      })
      return product
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`)
      }
      throw error
    }
  }

  async publish(id: string) {
    try {
      await prisma.product.update({
        where: {
          id
        },
        data: {
          isPublished: true
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`)
      }
      throw error
    }
  }

  async unpublish(id: string) {
    try {
      await prisma.product.update({
        where: {
          id
        },
        data: {
          isPublished: false
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`)
      }
      throw error
    }
  }
}
