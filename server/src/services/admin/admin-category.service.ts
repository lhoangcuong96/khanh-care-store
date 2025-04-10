import prisma from '@/database'
import { CreateCategoryBodyType } from '@/schemaValidations/admin/admin-category-schema'
import { StatusError } from '@/utils/errors'

export default class AdminCategoryService {
  static async list() {
    const data = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        image: {
          select: {
            featured: true,
            thumbnail: true
          }
        },
        subCategories: true
      },
      where: {
        parent: {
          is: null
        }
      }
    })
    return data
  }

  static async create(data: CreateCategoryBodyType) {
    const existedCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive'
        }
      }
    })
    if (existedCategory) {
      throw new StatusError({
        message: 'Category existed',
        status: 400
      })
    }
    let parentCategory
    if (data.parent) {
      parentCategory = await prisma.category.findUnique({
        where: {
          name: data.parent
        },
        select: {
          id: true
        }
      })
    }
    await prisma.category.create({
      data: {
        ...data,
        ...(parentCategory
          ? {
              parent: {
                connect: {
                  id: parentCategory.id
                }
              }
            }
          : {
              parent: undefined
            })
      }
    })
  }

  static async delete(ids: string[]) {
    await prisma.category.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    })
  }
}
