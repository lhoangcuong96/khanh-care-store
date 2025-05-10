import prisma from '@/database'
import {
  AdminCategoryInListType,
  AdminCreateCategoryBodyType,
  AdminUpdateCategoryBodyType
} from '@/schemaValidations/admin/admin-category-schema'
import { CategoryAttributeSchemaType } from '@/schemaValidations/category.schema'
import { CategoryStatus } from '@prisma/client'

export default class AdminCategoryService {
  static async list(): Promise<AdminCategoryInListType[]> {
    const data = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        status: true,
        attributes: {
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
          }
        },
        children: {
          where: {
            status: {
              not: CategoryStatus.DELETED
            }
          }
        }
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
    return data
  }

  static create = async (data: AdminCreateCategoryBodyType) => {
    const { name, description, slug, image, attributes, parentId, isFeatured, isShowOnHomePage } = data

    /* Check category exist or not*/
    const categoryExist = await prisma.category.findFirst({
      where: {
        OR: [{ name: name }, { slug: slug }]
      }
    })
    if (categoryExist) {
      throw new Error('Category already exists')
    }

    /* Create attributes*/
    const attributesData = attributes.map((categoryAttribute) => {
      return categoryAttribute.attribute
    })

    /* Create category*/
    const category = await prisma.category.create({
      data: {
        name,
        description,
        slug,
        image,
        isFeatured,
        isShowOnHomePage,
        ...(parentId ? { parent: { connect: { id: parentId } } } : {})
      }
    })

    if (attributesData.length > 0) {
      /* Create attributes*/
      const createdAttributes = await Promise.all(
        attributesData.map((attribute) => {
          return prisma.attribute.create({
            data: attribute
          })
        })
      )

      /* Create category attributes*/
      const createdCategoryAttribute = await prisma.categoryAttribute.createMany({
        data: attributes.map((attribute, index) => {
          return {
            filterable: attribute.filterable,
            filterType: attribute.filterType,
            displayOrder: attribute.displayOrder,
            required: attribute.required,
            categoryId: category.id,
            attributeId: createdAttributes[index]?.id
          }
        })
      })
    }
  }

  static async update(id: string, data: AdminUpdateCategoryBodyType) {
    const { name, description, slug, image, attributes, parentId, isFeatured, isShowOnHomePage } = data

    /* Check category exist or not*/
    const categoryExist = await prisma.category.findUnique({
      where: {
        id: id
      }
    })
    if (!categoryExist) {
      throw new Error('Category does not exist')
    }

    /* Update category*/
    await prisma.category.update({
      where: {
        id: id
      },
      data: {
        name,
        description,
        slug,
        image,
        isFeatured,
        isShowOnHomePage,
        ...(parentId ? { parent: { connect: { id: parentId } } } : {})
      }
    })

    /* Update attributes*/
    const attributesData = attributes.map((categoryAttribute) => {
      return categoryAttribute.attribute
    })
    if (attributesData.length > 0) {
      /* Create attributes*/
      const createdAttributes = await Promise.all(
        attributesData.map((attribute) => {
          const { id, ...rest } = attribute
          return prisma.attribute.upsert({
            where: {
              code: attribute.code
            },
            create: rest,
            update: rest
          })
        })
      )

      /* Create category attributes*/

      await prisma.categoryAttribute.deleteMany({
        where: {
          categoryId: id
        }
      })
      await prisma.categoryAttribute.createMany({
        data: attributes.map((attribute, index) => {
          return {
            filterable: attribute.filterable,
            filterType: attribute.filterType,
            displayOrder: attribute.displayOrder,
            required: attribute.required,
            categoryId: id,
            attributeId: createdAttributes[index]?.id
          }
        })
      })
    }
  }

  static async delete(ids: string[]) {
    /* Check category exist or not*/
    const categoryExist = await prisma.category.findMany({
      where: {
        id: {
          in: ids
        }
      }
    })
    if (categoryExist.length === 0) {
      throw new Error('Danh mục không tồn tại')
    }
    /* Check category has child or not*/
    const categoryHasChild = await prisma.category.findMany({
      where: {
        parentId: {
          in: ids
        },
        status: {
          not: CategoryStatus.DELETED
        }
      }
    })
    if (categoryHasChild.length > 0) {
      throw new Error('Hãy xoá các danh mục con trước khi xoá danh mục này')
    }
    /* Check category has product or not*/
    await prisma.category.updateMany({
      where: {
        id: {
          in: ids
        }
      },
      data: {
        status: CategoryStatus.DELETED,
        deletedAt: new Date()
      }
    })
  }

  static async getCategoryAttributes(id: string): Promise<CategoryAttributeSchemaType[]> {
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
            options: true,
            unit: true
          }
        }
      }
    })
    return data
  }

  static async getCategoryById(id: string) {
    const data = await prisma.category.findUnique({
      where: {
        id: id
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        isFeatured: true,
        isShowOnHomePage: true,
        parentId: true,
        attributes: {
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
                options: true,
                unit: true
              }
            }
          }
        }
      }
    })
    return data
  }
}
