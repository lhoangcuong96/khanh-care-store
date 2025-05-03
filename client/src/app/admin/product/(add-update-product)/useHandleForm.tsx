import { useState } from "react";

import { adminCategoryRequestApis } from "@/api-request/admin/category";
import { adminProductApiRequest } from "@/api-request/admin/product";
import { storageRequestApis } from "@/api-request/storage";
import { useHandleMessage } from "@/hooks/use-handle-message";
import { GetCategoryAttributesDataType as CategoryAttribute } from "@/validation-schema/admin/category";
import {
  ProductDetailType,
  type CreateProductBodyType,
} from "@/validation-schema/admin/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { routePath } from "@/constants/routes";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILE_SIZE = 300 * 1024 * 1024; // 300MB
export const MAX_PRODUCT_IMAGES = 9;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ProductCreationBaseFormSchema = z.object({
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
    .string({
      required_error: "Vui lòng nhập tên sản phẩm",
    })
    .min(10, "Tên sản phẩm phải có ít nhất 10 ký tự")
    .max(120, "Tên sản phẩm không được vượt quá 120 ký tự"),
  category: z
    .string({
      required_error: "Vui lòng chọn danh mục sản phẩm",
    })
    .min(1, "Vui lòng chọn danh mục sản phẩm"),
  description: z
    .string()
    .max(10000, "Mô tả sản phẩm không được vượt quá 10000 ký tự")
    .optional()
    .nullable(),
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
  isFeatured: z.boolean().optional().nullable(),
  isBestSeller: z.boolean().optional().nullable(),
  tags: z.array(z.any()).optional(),
});

export type ProductCreationBaseFormValues = z.infer<
  typeof ProductCreationBaseFormSchema
>;

const createAttributesSchema = (categoryAttributes: CategoryAttribute[]) => {
  const schemaMap: Record<string, any> = {};

  categoryAttributes.forEach((categoryAttribute) => {
    let fieldSchema: any;

    switch (categoryAttribute.attribute.type) {
      case "STRING":
        fieldSchema = z.string();
        if (categoryAttribute.required) {
          fieldSchema = fieldSchema.min(1, {
            message: `${categoryAttribute.attribute.name} là bắt buộc`,
          });
        }
        break;
      case "NUMBER":
        fieldSchema = z.number({
          required_error: `${categoryAttribute.attribute.name} là bắt buộc`,
          invalid_type_error: `${categoryAttribute.attribute.name} phải là số`,
        });
        break;
      case "BOOLEAN":
        fieldSchema = z.boolean();
        if (categoryAttribute.required) {
          fieldSchema = fieldSchema.refine((val: any) => val === true, {
            message: `${categoryAttribute.attribute.name} là bắt buộc`,
          });
        }
        break;
      case "DATE":
        fieldSchema = z.date({
          required_error: `${categoryAttribute.attribute.name} là bắt buộc`,
          invalid_type_error: `${categoryAttribute.attribute.name} phải là ngày hợp lệ`,
        });
        break;
      case "ENUM":
        fieldSchema = z.string({
          required_error: `${categoryAttribute.attribute.name} là bắt buộc`,
        });
        if (
          categoryAttribute.attribute.options &&
          categoryAttribute.attribute.options.length > 0
        ) {
          fieldSchema = fieldSchema.refine(
            (val: any) => categoryAttribute.attribute.options!.includes(val),
            {
              message: `${categoryAttribute.attribute.name} phải là một trong các giá trị hợp lệ`,
            }
          );
        }
        break;
      // case "RANGE":
      //   fieldSchema = z.number({
      //     required_error: `${categoryAttribute.attribute.name} là bắt buộc`,
      //     invalid_type_error: `${categoryAttribute.attribute.name} phải là số`,
      //   });
      //   if (categoryAttribute.attribute.min !== undefined) {
      //     fieldSchema = fieldSchema.min(categoryAttribute.attribute.min, {
      //       message: `${categoryAttribute.attribute.name} phải lớn hơn hoặc bằng ${categoryAttribute.attribute.min}`,
      //     });
      //   }
      //   if (categoryAttribute.attribute. !== undefined) {
      //     fieldSchema = fieldSchema.max(categoryAttribute.attribute.max, {
      //       message: `${categoryAttribute.attribute.name} phải nhỏ hơn hoặc bằng ${categoryAttribute.attribute.max}`,
      //     });
      //   }
      //   break;
      default:
        fieldSchema = z.any();
    }

    if (
      !categoryAttribute.required &&
      categoryAttribute.attribute.type !== "BOOLEAN"
    ) {
      fieldSchema = fieldSchema.optional();
    }

    schemaMap[categoryAttribute.attribute.id] = fieldSchema;
  });

  return z.object(schemaMap);
};

export function useHandleForm({
  productDetail,
}: {
  productDetail?: ProductDetailType;
}) {
  const [formSchema, setFormSchema] = useState(ProductCreationBaseFormSchema);
  const [categoryAttributes, setCategoryAttributes] = useState<
    CategoryAttribute[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { messageApi } = useHandleMessage();
  const router = useRouter();

  const form = useForm<ProductCreationBaseFormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
  });

  const selectedCategory = form.watch("category");

  const loadAttributes = async (categoryId: string) => {
    const res = await adminCategoryRequestApis.getCategoryAttributes(
      categoryId
    );

    setCategoryAttributes(res.payload?.data || []);
    form.clearErrors();
    const attributesSchema = createAttributesSchema(res.payload?.data || []);
    const newFormSchema = ProductCreationBaseFormSchema.extend({
      attributes: attributesSchema.optional(),
      variants: z
        .array(
          z.object({
            name: z
              .string({
                required_error: `Tên là bắt buộc`,
              })
              .min(1, "Tên là bắt buộc"),
            sku: z
              .string({
                required_error: `SKU là bắt buộc`,
              })
              .min(1, "SKU là bắt buộc"),
            price: z.number().min(1, "Giá là bắt buộc"),
            stock: z.number().min(1, "Số lượng là bắt buộc"),
            attributes: attributesSchema.optional(),
          })
        )
        .optional(),
    });
    setFormSchema(newFormSchema);
  };

  const onSubmit = async (data: Record<string, any>) => {
    let thumbnail = data.thumbnail;
    if (thumbnail instanceof File) {
      const generatePresignedUrlRes =
        await storageRequestApis.generatePresignedUrl(
          thumbnail.name,
          thumbnail.type
        );
      if (!generatePresignedUrlRes.payload?.data) {
        throw new Error("Lỗi upload avatar");
      }
      const { fileUrl, presignedUrl } = generatePresignedUrlRes.payload.data;
      await storageRequestApis.upload(presignedUrl, thumbnail);
      thumbnail = fileUrl;
    }

    const requestData: CreateProductBodyType = {
      name: data.name,
      price: data.price,
      description: data.description,
      stock: data.stock,
      image: {
        thumbnail,
        gallery: [],
        banner: "",
        featured: "",
      },
      categoryId: data.category,
      tags: [],
      attributes: data.attributes,
      isFeatured: data.isFeatured || false,
      isBestSeller: data.isBestSeller || false,
      variants: data.variants,
    };

    try {
      setIsSubmitting(true);
      if (productDetail) {
        await adminProductApiRequest.updateProduct(
          productDetail.id,
          requestData
        );
        messageApi.success({
          description: "Sửa sản phẩm thành công",
        });
      } else {
        await adminProductApiRequest.createProduct(requestData);
        messageApi.success({
          description: "Tạo sản phẩm thành công",
        });
      }
      router.push(routePath.admin.product.list);
    } catch (e) {
      messageApi.error({
        error: (e as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!selectedCategory) return;
    loadAttributes(selectedCategory);
  }, [selectedCategory, form]);

  return {
    formSchema,
    form,
    categoryAttributes,
    isLoading: false,
    error: "",
    selectedCategory,
    isSubmitting,
    onSubmit,
  };
}
