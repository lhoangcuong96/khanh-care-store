import z from "zod";
import { CommonQuery } from "../common";
import { ProductSchema } from "../product";

/* -----------------Product create---------------------- */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILE_SIZE = 300 * 1024 * 1024; // 300MB
export const MAX_PRODUCT_IMAGES = 9;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ProductCreationFormSchema = z.object({
  // productImages: z
  //   .array(
  //     z.union([
  //       z.instanceof(File, {
  //         message: "Hình ảnh không hợp lệ",
  //       }),
  //       z.string().url({
  //         message: "URL không hợp lệ",
  //       }),
  //     ]),
  //     {
  //       required_error: "Phải có ít nhất 1 hình ảnh sản phẩm",
  //     }
  //   )
  //   .min(1, "Phải có ít nhất 1 hình ảnh sản phẩm")
  //   .max(MAX_PRODUCT_IMAGES, "Chỉ được tải lên tối đa 9 hình ảnh")
  //   .refine((files) => {
  //     return files.every((files) => {
  //       return files instanceof File
  //         ? ACCEPTED_IMAGE_TYPES.includes(files.type)
  //         : true;
  //     });
  //   }, "Chỉ chấp nhận các định dạng ảnh: JPG, PNG, WEBP")
  //   .refine((files) => {
  //     return files.every((files) => {
  //       return files instanceof File ? files.size <= MAX_IMAGE_SIZE : true;
  //     });
  //   }, `Hình ảnh không được vượt quá ${MAX_IMAGE_SIZE / 1024 / 1024}MB`),
  thumbnail: z
    .union([
      z.instanceof(File, {
        message: "Hình ảnh không hợp lệ",
      }),
      z.string().url({
        message: "Hình ảnh không hợp lệ",
      }),
    ])
    .refine((file) => {
      return file instanceof File
        ? ACCEPTED_IMAGE_TYPES.includes(file.type)
        : true;
    }, "Chỉ chấp nhận các định dạng ảnh: JPG, PNG, WEBP")
    .refine((file) => {
      return file instanceof File ? file.size <= MAX_IMAGE_SIZE : true;
    }, `Hình ảnh không được vượt quá ${MAX_IMAGE_SIZE / 1024 / 1024}MB`),
  name: z
    .string()
    .min(10, "Tên sản phẩm phải có ít nhất 10 ký tự")
    .max(120, "Tên sản phẩm không được vượt quá 120 ký tự"),
  weight: z
    .number({
      required_error: "Vui lòng nhập khối lượng sản phẩm",
    })
    .min(0, "Khối lượng sản phẩm phải lớn hơn hoặc bằng 0")
    .max(1000000, "Khối lượng sản phẩm không được vượt quá 1000kg"),

  category: z.string().min(1, "Vui lòng chọn danh mục sản phẩm"),
  description: z
    .string()
    .min(1, "Vui lòng nhập mô tả sản phẩm")
    .max(10000, "Mô tả sản phẩm không được vượt quá 10000 ký tự"),
  price: z
    .number({
      required_error: "Vui lòng nhập giá bán",
    })
    .min(1, "Vui lòng nhập giá bán"),
  stock: z
    .number({
      required_error: "Vui lòng nhập số lượng",
    })
    .min(1, "Vui lòng nhập số lượng"),
  isFeatured: z.boolean(),
  isBestSeller: z.boolean(),
  tags: z.array(z.any()).optional(),
});
export type ProductCreationFormValues = z.infer<
  typeof ProductCreationFormSchema
>;

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
  isPublished: true,
})
  .merge(
    z.object({
      categoryId: z.string(),
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
export const ProductListQuerySchema = z.object({
  ...CommonQuery.shape,
  category: z.string().optional(),
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
  message: z.string(),
});
export type ProductListQueryType = z.TypeOf<typeof ProductListQuerySchema>;
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
  isPublished: true,
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
