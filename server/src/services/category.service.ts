import prisma from '@/database'
import { LiteCategoryInListType } from '@/schemaValidations/category.schema'
import { Category, CategoryStatus } from '@prisma/client/'

export class CategoryService {
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
        },
        status: {
          not: CategoryStatus.DELETED
        }
      }
    })
    console.log(data)
    return data
  }

  static async listLite(): Promise<LiteCategoryInListType[]> {
    const data = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        children: true
      },
      where: {
        parent: {
          is: null
        },
        status: CategoryStatus.ACTIVE
      }
    })
    return data
  }

  static async getCategoryAttributes(id: string) {
    const data = await prisma.categoryAttribute.findMany({
      where: {
        categoryId: id
      },
      select: {
        id: true,
        filterable: true,
        filterType: true,
        required: true,
        displayOrder: true,
        attribute: {
          select: {
            id: true,
            name: true,
            code: true,
            description: true,
            type: true,
            options: true
          }
        }
      },
      orderBy: {
        displayOrder: 'asc'
      }
    })
    return data
  }

  static getCategoryBySlug = ({ slug, select }: { slug: string; select?: Array<keyof Category> }) => {
    const defaultFields: Array<keyof Category> = ['id', 'name', 'description', 'slug', 'image']
    const selectObject: Partial<Record<keyof Category, boolean>> = (select || defaultFields).reduce(
      (acc, field) => {
        acc[field] = true
        return acc
      },
      {} as Partial<Record<keyof Category, boolean>>
    )

    return prisma.category.findUniqueOrThrow({
      where: {
        slug,
        status: CategoryStatus.ACTIVE
      },
      select: selectObject
    })
  }

  static getCategoryById = ({ id, select }: { id: string; select?: Array<keyof Category> }) => {
    const defaultFields: Array<keyof Category> = ['id', 'name', 'description', 'slug', 'image']
    const selectObject: Partial<Record<keyof Category, boolean>> = (select || defaultFields).reduce(
      (acc, field) => {
        acc[field] = true
        return acc
      },
      {} as Partial<Record<keyof Category, boolean>>
    )

    return prisma.category.findUniqueOrThrow({
      where: {
        id,
        status: CategoryStatus.ACTIVE
      },
      select: selectObject
    })
  }

  static getFeaturedCategories = () => {
    return prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        isFeatured: true
      },
      where: {
        isFeatured: true,
        status: CategoryStatus.ACTIVE
      }
    })
  }
}
