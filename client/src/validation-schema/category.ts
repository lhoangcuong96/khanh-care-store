import z from "zod";

export enum AttributeType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  DATE = "DATE",
  ENUM = "ENUM",
  RANGE = "RANGE",
}

export enum FilterType {
  CHECKBOX = "CHECKBOX",
  RADIO = "RADIO",
  SLIDER = "SLIDER",
  RANGE = "RANGE",
  COLOR_PICKER = "COLOR_PICKER",
  DROPDOWN = "DROPDOWN",
}

export const AttributeSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  description: z.string().optional().nullable(),
  options: z.any().optional().nullable(),
  unit: z.string().optional().nullable(),
  type: z.enum(
    Object.values(AttributeType) as [AttributeType, ...AttributeType[]]
  ),
});

export const CategoryAttributeSchema = z.object({
  id: z.string(),
  filterable: z.boolean(),
  filterType: z.enum(
    Object.values(FilterType) as [FilterType, ...FilterType[]]
  ),
  required: z.boolean(),
  displayOrder: z.number(),
  attribute: AttributeSchema,
});

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50),
  slug: z.string(),
  description: z.string().optional().nullable(),
  image: z.string(),
  parentId: z.string().optional().nullable(),
  isFeatured: z.boolean().optional().default(false),
  isShowOnHomePage: z.boolean().optional().default(false),
  parent: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
  children: z
    .array(z.lazy((): z.ZodType<any> => CategorySchema))
    .optional()
    .nullable(),
  attributes: z.array(CategoryAttributeSchema).optional().nullable(),
  products: z.array(z.any()).optional().nullable(),
});

export const FeaturedCategorySchema = CategorySchema.pick({
  id: true,
  name: true,
  image: true,
  slug: true,
});

export type AttributeSchemaType = z.infer<typeof AttributeSchema>;
export type CategoryAttributeSchemaType = z.infer<
  typeof CategoryAttributeSchema
>;
export type CategorySchemaType = z.infer<typeof CategorySchema>;
export type FeaturedCategoryType = z.infer<typeof FeaturedCategorySchema>;

/*----------------------List------------------------*/
export const CategoryInListSchema = CategorySchema.pick({
  id: true,
  name: true,
  slug: true,
  description: true,
  parentId: true,
  children: true,
});
export const ListCategoryResponseSchema = z.object({
  data: z.array(CategoryInListSchema),
  message: z.string(),
});

export const LiteCategoryInListSchema = CategorySchema.pick({
  name: true,
}).extend({
  id: z.string().optional(),
  children: z
    .array(
      CategorySchema.pick({
        id: true,
        name: true,
      })
    )
    .optional(),
});

export const ListCategoryResponseLiteSchema = z.object({
  data: z.array(LiteCategoryInListSchema),
  message: z.string(),
});

export type CategoryInListType = z.infer<typeof CategoryInListSchema>;
export type ListCategoryResponseType = z.infer<
  typeof ListCategoryResponseSchema
>;
export type LiteCategoryInListType = z.infer<typeof LiteCategoryInListSchema>;
export type ListCategoryResponseLiteType = z.infer<
  typeof ListCategoryResponseLiteSchema
>;
