import z from 'zod'
import { CommonQuery } from '../common.schema'
import { ProductAttributeValueSchema, ProductSchema, ProductVariantSchema } from '@/schemaValidations/product.schema'

export type ProductType = z.TypeOf<typeof ProductSchema>

/*----------------Create---------------------*/

export const CreateProductBodySchema = ProductSchema.omit({
  id: true,
  sold: true,
  createdAt: true,
  updatedAt: true,
  slug: true,
  isPromotion: true,
  promotionPercent: true,
  promotionStart: true,
  promotionEnd: true
})
  .merge(
    z.object({
      categoryId: z.string(),
      attributes: z.record(z.string(), z.any()).optional(),
      variants: z
        .array(
          z.object({
            name: z.string().min(1),
            sku: z.string().min(1),
            price: z.number().min(0),
            stock: z.number().min(0),
            attributes: z.record(z.string(), z.any()).optional()
          })
        )
        .optional()
    })
  )
  .strip()

export type CreateProductBodyType = z.TypeOf<typeof CreateProductBodySchema>
/*----------------End Create---------------------*/

/*----------------Update---------------------*/
export const UpdateProductParamsSchema = z.object({
  id: z.string()
})
export const UpdateProductBodySchema = CreateProductBodySchema

export type UpdateProductParamsType = z.TypeOf<typeof UpdateProductParamsSchema>
export type UpdateProductBodyType = CreateProductBodyType
/*----------------End Update---------------------*/

/*----------------List---------------------*/
export const ProductListQueryParamsSchema = z.object({
  ...CommonQuery.shape,
  category: z.string().optional(),
  priceFrom: z.coerce.number().optional(),
  priceTo: z.coerce.number().optional(),
  stockStatus: z.enum(['all', 'in_stock', 'low_stock', 'out_of_stock']).optional(),
  createdFrom: z.coerce.date().optional(),
  createdTo: z.coerce.date().optional(),
  isPublished: z.string().optional()
})

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
  image: true
})

export const ProductListResSchema = z.object({
  data: z.array(ProductInListSchema),
  total: z.number(),
  limit: z.number(),
  page: z.number(),
  totalPages: z.number(),
  message: z.string()
})
export type ProductListQueryType = z.TypeOf<typeof ProductListQueryParamsSchema>
export type ProductListResType = z.TypeOf<typeof ProductListResSchema>
export type ProductInListType = z.TypeOf<typeof ProductInListSchema>

/*----------------End List---------------------*/

/*----------------Detail---------------------*/
export const ProductDetailParamsSchema = z.object({
  slug: z.string()
})

export const ProductDetailSchema = ProductSchema.omit({
  sold: true,
  createdAt: true,
  updatedAt: true,
  slug: true,
  isPromotion: true,
  promotionPercent: true,
  promotionStart: true,
  promotionEnd: true,
  isPublished: true
}).merge(
  z.object({
    category: z
      .object({
        id: z.string(),
        name: z.string()
      })
      .optional()
      .nullable(),
    attributes: z.array(
      z.object({
        attributeId: z.string(),
        value: z.any()
      })
    ),
    variants: z.array(
      ProductVariantSchema.omit({
        id: true,
        isPromotion: true,
        promotionPercent: true,
        promotionStart: true,
        promotionEnd: true
      }).merge(
        z.object({
          attributes: z.array(
            z.object({
              attributeId: z.string(),
              value: z.any()
            })
          )
        })
      )
    )
  })
)
export const ProductDetailResponseSchema = z.object({
  data: ProductDetailSchema,
  message: z.string()
})

export type ProductDetailParamsType = z.TypeOf<typeof ProductDetailParamsSchema>
export type ProductDetailType = z.TypeOf<typeof ProductDetailSchema>
export type ProductDetailResponseType = z.TypeOf<typeof ProductDetailResponseSchema>
/*----------------End Detail---------------------*/

/*----------------Delete---------------------*/
export const DeleteProductParamsSchema = z.object({
  id: z.string()
})
export type DeleteProductParamsType = z.TypeOf<typeof DeleteProductParamsSchema>

/*----------------Publish---------------------*/
export const PublishProductParamsSchema = z.object({
  id: z.string()
})

export type PublishProductParamsType = z.TypeOf<typeof PublishProductParamsSchema>
/*----------------End Publish---------------------*/

/*----------------Unpublish---------------------*/
export const UnpublishProductParamsSchema = z.object({
  id: z.string()
})

export type UnpublishProductParamsType = z.TypeOf<typeof UnpublishProductParamsSchema>
/*----------------End Unpublish---------------------*/
