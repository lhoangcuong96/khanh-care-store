import z from "zod";
import { CommonQuery } from "../common";
import { ProductSchema } from "../product";

/* -----------------Product create---------------------- */

export const CreateProductBodySchema = ProductSchema.omit({
  id: true,
  sold: true,
  createdAt: true,
  updatedAt: true,
  slug: true,
  isPromotion: true,
  promotionPrice: true,
  promotionPercent: true,
  promotionStart: true,
  promotionEnd: true,
})
  .merge(
    z.object({
      categoryId: z.string(),
      attributes: z.record(z.string(), z.string()).optional(),
      variants: z
        .array(
          z.object({
            name: z.string().min(1, "Tên là bắt buộc"),
            sku: z.string().min(1, "SKU là bắt buộc"),
            price: z.number().min(0, "Giá là bắt buộc"),
            stock: z.number().min(0, "Số lượng là bắt buộc"),
            attributes: z.record(z.string(), z.string()).optional(),
          })
        )
        .optional(),
    })
  )
  .strip();

export type CreateProductBodyType = z.TypeOf<typeof CreateProductBodySchema>;
/*----------------End Create---------------------*/

/*----------------Update---------------------*/
export const UpdateProductParamsSchema = z.object({
  id: z.string(),
});
export const UpdateProductBodySchema = CreateProductBodySchema;

export type UpdateProductParamsType = z.TypeOf<
  typeof UpdateProductParamsSchema
>;
export type UpdateProductBodyType = CreateProductBodyType;
/*----------------End Update---------------------*/

/*----------------List---------------------*/
export const ProductListQueryParamsSchema = z.object({
  ...CommonQuery.shape,
  category: z.string().optional(),
  priceFrom: z.coerce.number().optional(),
  priceTo: z.coerce.number().optional(),
  stockStatus: z
    .enum(["all", "in_stock", "low_stock", "out_of_stock"])
    .optional(),
  createdFrom: z.coerce.date().optional(),
  createdTo: z.coerce.date().optional(),
  isPublished: z.string().optional(),
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
  promotionPrice: true,
  promotionPercent: true,
  promotionStart: true,
  promotionEnd: true,
  image: true,
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
export type ProductListResponseType = z.TypeOf<typeof ProductListResSchema>;
export type ProductInListType = z.TypeOf<typeof ProductInListSchema>[];

/*----------------End List---------------------*/

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
  promotionPrice: true,
  promotionPercent: true,
  promotionStart: true,
  promotionEnd: true,
}).merge(
  z.object({
    category: z.object({
      id: z.string(),
      name: z.string(),
    }),
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

/*----------------Delete---------------------*/
export const DeleteProductParamsSchema = z.object({
  id: z.string(),
});
export type DeleteProductParamsType = z.TypeOf<
  typeof DeleteProductParamsSchema
>;
/*----------------End Delete---------------------*/
