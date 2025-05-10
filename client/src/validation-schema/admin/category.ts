import { z } from "zod";
import {
  AttributeSchema,
  CategoryAttributeSchema,
  CategorySchema,
} from "../category";

/* -------------------- Create ------------------------*/
export const AdminCreateCategoryBodySchema = CategorySchema.pick({
  name: true,
  slug: true,
  description: true,
  image: true,
  parentId: true,
}).extend({
  attributes: z.array(
    CategoryAttributeSchema.pick({
      filterable: true,
      filterType: true,
      required: true,
      displayOrder: true,
    }).merge(
      z.object({
        attribute: AttributeSchema.pick({
          name: true,
          code: true,
          description: true,
          type: true,
          options: true,
          unit: true,
        }),
      })
    )
  ),
});

export type AdminCreateCategoryBodyType = z.infer<
  typeof AdminCreateCategoryBodySchema
>;
/* -------------------- Create ------------------------*/

/*----------------------Update------------------------*/
export const AdminUpdateCategoryBodySchema = CategorySchema.pick({
  name: true,
  slug: true,
  description: true,
  image: true,
  parentId: true,
  isFeatured: true,
  isShowOnHomePage: true,
}).extend({
  attributes: z.array(
    CategoryAttributeSchema.pick({
      filterable: true,
      filterType: true,
      required: true,
      displayOrder: true,
    }).merge(
      z.object({
        attribute: AttributeSchema.pick({
          name: true,
          code: true,
          description: true,
          type: true,
          options: true,
          unit: true,
        }).merge(z.object({ id: z.string().optional().nullable() })),
        id: z.string().optional().nullable(),
      })
    )
  ),
  id: z.string().optional().nullable(),
});

export type AdminUpdateCategoryBodyType = z.infer<
  typeof AdminUpdateCategoryBodySchema
>;

/*----------------------End update------------------------*/

/*----------------------List------------------------*/
export const AdminCategoryInListSchema = CategorySchema.pick({
  id: true,
  name: true,
  slug: true,
  description: true,
  image: true,
  children: true,
  attributes: true,
});

export const AdminListCategoryResponseSchema = z.object({
  data: z.array(AdminCategoryInListSchema),
  message: z.string(),
});
export type AdminCategoryInListType = z.infer<typeof AdminCategoryInListSchema>;
export type AdminListCategoryResponseType = z.infer<
  typeof AdminListCategoryResponseSchema
>;
/*----------------------End list------------------------*/

/*----------------------Get category detail------------------------*/
export const AminCategoryDetailSchema = CategorySchema.pick({
  id: true,
  name: true,
  slug: true,
  description: true,
  image: true,
  parentId: true,
  isFeatured: true,
  isShowOnHomePage: true,
  attributes: true,
});

export const GetCategoryDetailResponseSchema = z.object({
  data: AminCategoryDetailSchema,
  message: z.string(),
});
export type GetCategoryDetailResponseType = z.infer<
  typeof GetCategoryDetailResponseSchema
>;
export type GetCategoryDetailDataType = z.infer<
  typeof AminCategoryDetailSchema
>;
/*----------------------End get category detail------------------------*/

/*----------------------Get Category Attributes-----------------------*/
export const GetCategoryAttributesDataSchema = CategoryAttributeSchema;
export const GetCategoryAttributesResponseSchema = z.object({
  data: z.array(GetCategoryAttributesDataSchema),
  message: z.string(),
});

export type GetCategoryAttributesResponseType = z.infer<
  typeof GetCategoryAttributesResponseSchema
>;
export type GetCategoryAttributesDataType = z.infer<
  typeof GetCategoryAttributesDataSchema
>;
/*----------------------End Get Category Attributes-----------------------*/
