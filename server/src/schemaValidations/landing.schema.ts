import z from 'zod'
import { ProductInListSchema } from './product.schema'
import { CategorySchema } from './category.schema'

export const FeaturedCategoriesSchema = CategorySchema.pick({
  id: true,
  name: true,
  image: true,
  slug: true
})

export const GetLandingDataSchema = z.object({
  featuredCategories: z.array(FeaturedCategoriesSchema),
  featuredProducts: z.array(ProductInListSchema),
  promotionalProducts: z.array(ProductInListSchema),
  bestSellerProducts: z.array(ProductInListSchema)
})

export const GetLandingResponseSchema = z.object({
  data: GetLandingDataSchema,
  message: z.string()
})
export type GetLandingDataType = z.TypeOf<typeof GetLandingDataSchema>
export type GetLandingResponseType = z.TypeOf<typeof GetLandingResponseSchema>
