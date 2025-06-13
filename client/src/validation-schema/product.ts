import z from "zod";
import { CommonQuery } from "./common";

export const ProductImageSchema = z.object({
  thumbnail: z.string(),
  banner: z.string().nullable().optional(),
  featured: z.string().nullable().optional(),
  gallery: z.array(z.string()).nullable().optional(),
});

export const ProductAttributeValueSchema = z.object({
  id: z.string(),
  value: z.any(),
});

export const ProductVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  price: z.number(),
  stock: z.number(),
  attributes: z.array(ProductAttributeValueSchema),
  image: ProductImageSchema,
  isPromotion: z.boolean(),
  promotionPercent: z.number().optional().nullable(),
  promotionStart: z.union([z.string(), z.date()]).optional().nullable(),
  promotionEnd: z.union([z.string(), z.date()]).optional().nullable(),
});
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(256),
  title: z.string().min(1).max(256).optional().nullable(),
  price: z.number().positive(),
  description: z.string().max(100000).optional().nullable(),
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
  isFavorite: z.boolean().optional().nullable(),
  image: ProductImageSchema,
  categoryId: z.string(),
  category: z.any(),
  tags: z.array(z.string()),
  variants: z.array(ProductVariantSchema),
  attributes: z.any(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
});
/*----------------Detail---------------------*/
export const ProductDetailParamsSchema = z.object({
  slug: z.coerce.string(),
});
export const ProductDetailSchema = ProductSchema.omit({
  sold: true,
  createdAt: true,
  updatedAt: true,
  slug: true,
  isPromotion: true,
  promotionPercent: true,
  promotionStart: true,
  promotionEnd: true,
  isPublished: true,
}).merge(
  z.object({
    category: z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .optional()
      .nullable(),
    variants: z.array(
      ProductVariantSchema.omit({
        isPromotion: true,
        promotionPercent: true,
        promotionStart: true,
        promotionEnd: true,
      }).merge(
        z.object({
          attributes: z.array(ProductAttributeValueSchema),
        })
      )
    ),
  })
);

export const ProductDetailResponseSchema = z.object({
  data: ProductDetailSchema,
  message: z.string(),
});

export type ProductDetailParamsType = z.TypeOf<
  typeof ProductDetailParamsSchema
>;
export type ProductDetailType = z.TypeOf<typeof ProductDetailSchema>;
export type ProductDetailResponseType = z.TypeOf<
  typeof ProductDetailResponseSchema
>;
/*----------------End Detail---------------------*/

/*----------------List---------------------*/
export const ProductListQueryParamsSchema = z
  .object({
    ...CommonQuery.shape,
    category: z.string().optional(),
    isFeatured: z.union([z.string(), z.boolean()]).optional(),
    isBestSeller: z.union([z.string(), z.boolean()]).optional(),
    isPromotion: z.union([z.string(), z.boolean()]).optional(),
  })
  .strip();

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
  image: true,
  isFavorite: true,
}).extend({
  variants: z
    .array(
      ProductVariantSchema.pick({
        id: true,
        name: true,
        price: true,
        stock: true,
      })
    )
    .optional()
    .nullable(),
});

export const ProductListResSchema = z.object({
  data: z.array(ProductInListSchema),
  total: z.number(),
  limit: z.number(),
  page: z.number(),
  totalPages: z.number(),
  message: z.string(),
});
export type ProductListQueryType = z.TypeOf<
  typeof ProductListQueryParamsSchema
>;
export type ProductListResType = z.TypeOf<typeof ProductListResSchema>;
export type ProductInListType = z.TypeOf<typeof ProductInListSchema>;

/*----------------End List---------------------*/
