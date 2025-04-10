import { z } from "zod";
import { CommonQuery } from "./common";

export const ProductImageSchema = z.object({
  thumbnail: z.string(),
  banner: z.string().nullable().optional(),
  featured: z.string().nullable().optional(),
  gallery: z.array(z.string()),
});

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
  promotionPrice: z.number().optional().nullable(),
  promotionPercent: z.number().optional().nullable(),
  promotionStart: z.union([z.string(), z.date()]).optional().nullable(),
  promotionEnd: z.union([z.string(), z.date()]).optional().nullable(),
  isPublished: z.boolean(),
  image: ProductImageSchema,
  category: z.any(),
  tags: z.array(z.string()),
  attributes: z.any(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
});
/*-----------------Product detail----------------------*/

export const productDetailSchema = ProductSchema.pick({
  id: true,
  name: true,
  price: true,
  slug: true,
  description: true,
  stock: true,
  image: true,
});

export const productResponseSchema = z.object({
  data: productDetailSchema,
  message: z.string(),
});

export type ProductDetailType = z.infer<typeof productDetailSchema>;
export type ProductDetailResponseType = z.infer<typeof productResponseSchema>;

/*-----------------Product detail----------------------*/

/*----------------List---------------------*/
export const ProductListQuerySchema = z.object({
  ...CommonQuery.shape,
  category: z.string().optional(),
  slug: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isPromotion: z.boolean().optional(),
  price: z.array(z.string()).optional(),
  weight: z.array(z.string()).optional(),
});

export const ProductInListSchema = ProductSchema.pick({
  id: true,
  name: true,
  price: true,
  stock: true,
  sold: true,
  slug: true,
  isFeatured: true,
  isBestSeller: true,
  isPublished: true,
  isPromotion: true,
  promotionPercent: true,
  promotionStart: true,
  promotionEnd: true,
  image: true,
});

export const ProductListResSchema = z.object({
  data: z.array(ProductInListSchema),
  message: z.string(),
});
export type ProductListQueryType = z.TypeOf<typeof ProductListQuerySchema>;
export type ProductListResponseType = z.TypeOf<typeof ProductListResSchema>;
export type ProductInListType = z.TypeOf<typeof ProductInListSchema>;

/*----------------End List---------------------*/
