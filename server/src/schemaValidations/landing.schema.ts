import z from 'zod'
import { ProductInListSchema } from './product.schema'

export const GetLandingDataSchema = z.object({
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
