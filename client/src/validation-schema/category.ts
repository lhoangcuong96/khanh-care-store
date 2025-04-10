import { z } from "zod";

/*---------------------Create-------------------------*/
export const MAX_CATEGORY_SAMPLE_IMAGES = 5;

export const CategoryImageSchema = z.object({
  thumbnail: z.string().url().nullable().optional(),
  banner: z.string().url().nullable().optional(),
  featured: z.union([
    z.instanceof(File, {
      message: "Hình ảnh không hợp lệ",
    }),
    z.string().url({
      message: "Hình ảnh không hợp lệ",
    }),
  ]),
  sample: z
    .array(
      z.union([
        z.instanceof(File, {
          message: "Hình ảnh không hợp lệ",
        }),
        z.string().url({
          message: "Hình ảnh không hợp lệ",
        }),
      ])
    )
    .max(MAX_CATEGORY_SAMPLE_IMAGES, {
      message: `Tối đa ${MAX_CATEGORY_SAMPLE_IMAGES} hình`,
    })
    .min(1, {
      message: "Ít nhất một hình",
    }),
});

export const CreateCategorySchema = z.object({
  name: z
    .string({ required_error: "Tên loại sản phẩm không được để trống" })
    .min(1, {
      message: "Tên loại sản phẩm không được để trống",
    }),
  description: z.string().optional().nullable(),
  image: z.object(CategoryImageSchema.shape),
  parent: z.string().optional().nullable(),
  attributes: z
    .array(z.string(), {
      message: "Ít nhất một thuộc tính",
    })
    .min(1, {
      message: "Ít nhất một thuộc tính",
    }),
});

export type CreateCategoryType = z.infer<typeof CreateCategorySchema>;
/*---------------------End create----------------------*/

/*---------------------List-------------------------*/
export const CategoryInListSchema: z.ZodSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    image: CategoryImageSchema,
  })
);

export const ListCategoryResponseSchema = z.object({
  data: z.array(CategoryInListSchema),
  message: z.string(),
});

export type CategoryInListType = z.infer<typeof CategoryInListSchema>;
export type ListCategoryResponseType = z.infer<
  typeof ListCategoryResponseSchema
>;
/*---------------------End list---------------------*/
