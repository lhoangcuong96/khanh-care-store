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

export class AdminProductService {
  async create(data: CreateProductBodyType): Promise<void> {
    const { categoryId, attributes, variants, ...rest } = data
    const slug = slugify(rest.name)

    const productAttributes = Object.keys(data.attributes || {}).map((key) => {
      return {
        key,
        value: data.attributes?.[key]
      }
    })

    prisma.$transaction(async (tx) => {
      const createdProduct = await prisma.product.create({
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
        await prisma.productAttributeValue.createMany({
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
      variants?.forEach(async (variant) => {
        const createdVariant = await prisma.productVariant.create({
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
            value: data.attributes?.[key]
          }
        })
        if (variantAttributes.length > 0) {
          await prisma.productAttributeValue.createMany({
            data:
              variantAttributes?.map((attribute) => {
                return {
                  productId: createdProduct.id,
                  attributeId: attribute.key,
                  value: attribute.value || ''
                }
              }) || []
          })
        }
      })
    })
    /* Create product*/
  }

  async list(queryParams: ProductListQueryType): Promise<ProductInListType> {
    const { page = 1, limit = 20, category, sort = 'createdAt', order = Order.Desc, search } = queryParams
    const skip = (page - 1) * limit
    const take = limit
    const where = {
      AND: [
        category
          ? {
              categories: {
                some: {
                  name: {
                    equals: category
                  }
                }
              }
            }
          : {},
        search ? { name: { contains: search }, mode: 'insensitive' } : {}
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

    return prisma.product.findMany({
      where,
      skip,
      take,
      orderBy,
      select
    })
  }

  async update(id: string, data: UpdateProductBodyType): Promise<Partial<ProductType>> {
    const { categoryId, ...rest } = data
    const slug = slugify(rest.name)
    const product = await prisma.product.update({
      where: {
        id
      },
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
    return product as Partial<ProductType>
  }

  async delete(id: string) {
    await prisma.product.delete({
      where: {
        id
      }
    })
  }

  async getDetailBySlug(slug: string): Promise<ProductDetailType> {
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
        isPublished: true,
        image: true,
        isFeatured: true,
        isBestSeller: true,
        category: true,
        attributes: {
          select: {
            id: true,
            value: true
          }
        },
        tags: true,
        variants: {
          select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            stock: true,
            attributes: {
              select: {
                id: true,
                value: true
              }
            }
          }
        }
      }
    })
    console.log(product)
    return product
  }
}
