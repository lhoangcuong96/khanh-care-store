import z, { any } from 'zod'
import { AttributeSchema, CategoryAttributeSchema, CategorySchema } from '../category.schema'

/* -------------------- Create ------------------------*/
export const AdminCreateCategoryBodySchema = CategorySchema.pick({
  name: true,
  slug: true,
  description: true,
  image: true,
  parentId: true
}).extend({
  attributes: z.array(
    AttributeSchema.pick({
      name: true,
      code: true,
      description: true,
      type: true,
      options: true,
      unit: true
    }).merge(
      CategoryAttributeSchema.pick({
        filterable: true,
        filterType: true,
        required: true,
        displayOrder: true
      })
    )
  )
})

export type AdminCreateCategoryBodyType = z.infer<typeof AdminCreateCategoryBodySchema>
/*----------------------End Create------------------------*/

/*----------------------List------------------------*/
export const AdminCategoryInListSchema = CategorySchema.pick({
  id: true,
  name: true,
  slug: true,
  description: true,
  image: true,
  children: true,
  attributes: true
})

export const AdminListCategoryResponseSchema = z.object({
  data: z.array(AdminCategoryInListSchema),
  message: z.string()
})

export const AdminLiteCategoryInListSchema = CategorySchema.pick({
  id: true,
  name: true
}).extend({
  children: z.array(
    CategorySchema.pick({
      id: true,
      name: true
    })
  )
})

export type AdminCategoryInListType = z.infer<typeof AdminCategoryInListSchema>
export type AdminListCategoryResponseType = z.infer<typeof AdminListCategoryResponseSchema>

/*----------------------End list------------------------*/

/*----------------------Delete-----------------------*/
export const DeleteCategoryBodySchema = z.object({
  ids: z.array(z.string())
})

export type DeleteCategoryBodyType = z.infer<typeof DeleteCategoryBodySchema>
/*----------------------End Delete------------------------*/

/*----------------------Get Category Attributes-----------------------*/
export const GetCategoryAttributesParamsSchema = z.object({
  id: z.string()
})
export const GetCategoryAttributesResponseSchema = z.object({
  data: z.array(CategoryAttributeSchema),
  message: z.string()
})
