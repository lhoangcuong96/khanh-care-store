import { z } from "zod";
import {
  AttributeSchema,
  CategoryAttributeSchema,
  CategorySchema,
} from "../category";

/* -------------------- Create ------------------------*/
export const CreateCategoryBodySchema = CategorySchema.pick({
  name: true,
  slug: true,
  description: true,
  image: true,
  parentId: true,
}).extend({
  attributes: z.array(
    AttributeSchema.pick({
      name: true,
      code: true,
      description: true,
      type: true,
      options: true,
    }).merge(
      CategoryAttributeSchema.pick({
        filterable: true,
        filterType: true,
        required: true,
        displayOrder: true,
      })
    )
  ),
});

export type CreateCategoryBodyType = z.infer<typeof CreateCategoryBodySchema>;
/* -------------------- Create ------------------------*/

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
