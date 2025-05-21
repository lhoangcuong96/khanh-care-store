import z, { any } from 'zod'
import { AttributeSchema, CategoryAttributeSchema, CategorySchema } from '../category.schema'

/* -------------------- Create ------------------------*/
export const AdminCreateCategoryBodySchema = CategorySchema.pick({
  name: true,
  slug: true,
  description: true,
  image: true,
  parentId: true,
  isFeatured: true,
  isShowOnHomePage: true
}).extend({
  attributes: z.array(
    CategoryAttributeSchema.pick({
      filterable: true,
      filterType: true,
      required: true,
      displayOrder: true
    }).merge(
      z.object({
        attribute: AttributeSchema.pick({
          name: true,
          code: true,
          description: true,
          type: true,
          options: true,
          unit: true
        })
      })
    )
  )
})

export type AdminCreateCategoryBodyType = z.infer<typeof AdminCreateCategoryBodySchema>
/*----------------------End Create------------------------*/

/*----------------------Update------------------------*/
export const AdminUpdateCategoryParamsSchema = z.object({
  id: z.string()
})

export const AdminUpdateCategoryBodySchema = CategorySchema.pick({
  id: true,
  name: true,
  slug: true,
  description: true,
  image: true,
  parentId: true,
  isFeatured: true,
  isShowOnHomePage: true
}).extend({
  attributes: z.array(
    CategoryAttributeSchema.pick({
      filterable: true,
      filterType: true,
      required: true,
      displayOrder: true
    }).merge(
      z.object({
        attribute: AttributeSchema.pick({
          name: true,
          code: true,
          description: true,
          type: true,
          options: true,
          unit: true
        }).merge(z.object({ id: z.string().optional().nullable() })),
        id: z.string().optional().nullable()
      })
    )
  )
})

export type AdminUpdateCategoryBodyType = z.infer<typeof AdminUpdateCategoryBodySchema>
export type AdminUpdateCategoryParamsType = z.infer<typeof AdminUpdateCategoryParamsSchema>

/*----------------------End update------------------------*/

/*----------------------List------------------------*/
export const AdminCategoryInListSchema = CategorySchema.pick({
  id: true,
  name: true,
  slug: true,
  description: true,
  image: true,
  children: true,
  attributes: true
}).extend({
  totalProduct: z.number()
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
export const AdminDeleteCategoryParamsSchema = z.object({
  id: z.string()
})

export type AdminDeleteCategoryParamsType = z.infer<typeof AdminDeleteCategoryParamsSchema>
/*----------------------End Delete------------------------*/

/*----------------------Get Category Attributes-----------------------*/
export const GetCategoryAttributesParamsSchema = z.object({
  id: z.string()
})
export const GetCategoryAttributesResponseSchema = z.object({
  data: z.array(CategoryAttributeSchema),
  message: z.string()
})

/*----------------------Get category detail------------------------*/

export const GetCategoryByIdParamsSchema = z.object({
  id: z.string()
})
export const AdminCategoryDetailSchema = CategorySchema.pick({
  id: true,
  name: true,
  slug: true,
  description: true,
  image: true,
  parentId: true,
  isFeatured: true,
  isShowOnHomePage: true,
  attributes: true
})

export const GetCategoryDetailResponseSchema = z.object({
  data: AdminCategoryDetailSchema,
  message: z.string()
})
export type GetCategoryDetailResponseType = z.infer<typeof GetCategoryDetailResponseSchema>
export type GetCategoryDetailDataType = z.infer<typeof AdminCategoryDetailSchema>
export type GetCategoryAttributesParamsType = z.infer<typeof GetCategoryAttributesParamsSchema>
/*----------------------End get category detail------------------------*/
