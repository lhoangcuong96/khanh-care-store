import z from 'zod'
import { CommonQuery } from './common.schema'

export const ProductImageSchema = z.object({
  thumbnail: z.string(),
  banner: z.string().nullable().optional(),
  featured: z.string().nullable().optional(),
  gallery: z.array(z.string()).nullable().optional()
})

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(256),
  title: z.string().min(1).max(256).optional().nullable(),
  price: z.number().positive(),
  description: z.string().max(10000).optional().nullable(),
  slug: z.string().min(1).max(256),
  stock: z.number().positive(),
  sold: z.number().optional().nullable(),
  isFeatured: z.boolean(),
  isBestSeller: z.boolean(),
  isPromotion: z.boolean(),
  promotionPercent: z.number().optional().nullable(),
  promotionStart: z.union([z.string(), z.date()]).optional().nullable(),
  promotionEnd: z.union([z.string(), z.date()]).optional().nullable(),
  isPublished: z.boolean(),
  image: ProductImageSchema,
  category: z.any(),
  tags: z.array(z.string()),
  attributes: z.any(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()])
})

/*----------------List---------------------*/
export const ProductListQueryParamsSchema = z
  .object({
    ...CommonQuery.shape,
    category: z.string().optional(),
    isFeatured: z.union([z.string(), z.boolean()]).optional(),
    isBestSeller: z.union([z.string(), z.boolean()]).optional(),
    isPromotion: z.union([z.string(), z.boolean()]).optional(),
    price: z.string().optional(),
    weight: z.string().optional()
  })
  .strip()

export const ProductInListSchema = ProductSchema.pick({
  id: true,
  name: true,
  price: true,
  stock: true,
  sold: true,
  slug: true,
  isFeatured: true,
  isBestSeller: true,
  isPromotion: true,
  promotionPercent: true,
  promotionStart: true,
  promotionEnd: true,
  image: true
})

export const ProductListResSchema = z.object({
  data: z.array(ProductInListSchema),
  message: z.string()
})
export type ProductListQueryType = z.TypeOf<typeof ProductListQueryParamsSchema>
export type ProductListResType = z.TypeOf<typeof ProductListResSchema>
export type ProductInListType = z.TypeOf<typeof ProductInListSchema>[]

/*----------------End List---------------------*/

/*----------------Detail---------------------*/
export const ProductDetailParamsSchema = z.object({
  slug: z.coerce.string()
})
export const ProductDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  stock: z.number(),
  image: ProductImageSchema
})
export const ProductDetailResponseSchema = z.object({
  data: ProductDetailSchema,
  message: z.string()
})

export type ProductDetailParamsType = z.TypeOf<typeof ProductDetailParamsSchema>
export type ProductDetailType = z.TypeOf<typeof ProductDetailSchema>
export type ProductDetailResponseType = z.TypeOf<typeof ProductDetailResponseSchema>
/*----------------End Detail---------------------*/
