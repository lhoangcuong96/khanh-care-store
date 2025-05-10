import z from "zod";
import { ProductInListSchema } from "./product";
import { FeaturedCategoriesSchema } from "./category";

export const GetLandingDataSchema = z.object({
  featuredCategories: z.array(FeaturedCategoriesSchema),
  featuredProducts: z.array(ProductInListSchema),
  promotionalProducts: z.array(ProductInListSchema),
  bestSellerProducts: z.array(ProductInListSchema),
});

export const GetLandingResponseSchema = z.object({
  data: GetLandingDataSchema,
  message: z.string(),
});
export type GetLandingDataType = z.TypeOf<typeof GetLandingDataSchema>;
export type GetLandingResponseType = z.TypeOf<typeof GetLandingResponseSchema>;
