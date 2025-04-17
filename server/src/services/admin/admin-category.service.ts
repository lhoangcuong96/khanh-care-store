import prisma from '@/database'
import { AdminCategoryInListType, AdminCreateCategoryBodyType } from '@/schemaValidations/admin/admin-category-schema'

export default class AdminCategoryService {
  static async list(): Promise<AdminCategoryInListType[]> {
    const data = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        children: true,
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
        }
      },
      where: {
        parent: {
          is: null
        }
      }
    })
    return data
  }

  static create = async (data: AdminCreateCategoryBodyType) => {
    const { name, description, slug, image, attributes, parentId } = data

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
    const attributesData = attributes.map((attribute) => {
      return {
        name: attribute.name,
        description: attribute.description,
        code: attribute.code,
        type: attribute.type,
        options: []
      }
    })

    /* Create category*/
    const category = await prisma.category.create({
      data: {
        name,
        description,
        slug,
        image,
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
      const categoryAttribute = await prisma.categoryAttribute.createMany({
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
