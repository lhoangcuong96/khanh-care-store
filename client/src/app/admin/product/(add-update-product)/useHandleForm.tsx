import { useCallback, useMemo, useState } from "react";

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

const ProductCreationBaseFormSchema = z.object({
  name: z
    .string({
      required_error: "Vui lòng nhập tên sản phẩm",
    })
    .min(1, "Vui lòng nhập tên sản phẩm")
    .max(120, "Tên sản phẩm không được vượt quá 120 ký tự"),
  description: z
    .string({
      required_error: "Vui lòng nhập mô tả sản phẩm",
    })
    .min(1, "Vui lòng nhập mô tả sản phẩm"),
  thumbnail: z.any({
    required_error: "Vui lòng chọn hình ảnh sản phẩm",
  }),
  productGallery: z.array(z.any()).optional(),
  category: z
    .string({
      required_error: "Vui lòng chọn danh mục sản phẩm",
    })
    .min(1, "Vui lòng chọn danh mục sản phẩm"),
  price: z
    .number({
      required_error: "Vui lòng nhập giá sản phẩm",
    })
    .min(1, "Vui lòng nhập giá sản phẩm"),
  stock: z
    .number({
      required_error: "Vui lòng nhập số lượng",
    })
    .min(1, "Vui lòng nhập số lượng"),
  isFeatured: z.boolean().optional().nullable(),
  isBestSeller: z.boolean().optional().nullable(),
  isPublished: z.boolean().optional().default(false),
  tags: z.array(z.any()).optional(),
  attributes: z.record(z.any()).optional(),
  variants: z.array(z.any()).optional(),
});

export type ProductCreationBaseFormValues = z.infer<
  typeof ProductCreationBaseFormSchema
> & {
  attributes?: Record<string, any>;
  variants?: Array<{
    name: string;
    sku: string;
    price: number;
    stock: number;
    attributes?: Record<string, any>;
  }>;
};

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

  const categoryAttributeIds = useMemo(() => {
    return categoryAttributes.map((item) => item.attribute.id);
  }, [categoryAttributes]);

  const getDefaultValues = (): any => {
    if (!productDetail) return {};
    return {
      name: productDetail.name || "",
      description: productDetail.description || "",
      thumbnail: productDetail.image?.thumbnail || "",
      productGallery: productDetail.image?.gallery || [],
      category: productDetail.categoryId || "",
      price: productDetail.price || 0,
      stock: productDetail.stock || 0,
      isFeatured: productDetail.isFeatured ?? false,
      isBestSeller: productDetail.isBestSeller ?? false,
      tags: productDetail.tags || [],
    };
  };

  const form = useForm<ProductCreationBaseFormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: getDefaultValues(),
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
    setFormSchema(newFormSchema as any);
  };

  const onSubmit = async (data: Record<string, any>) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      let thumbnail = data.thumbnail;
      let gallery = data.productGallery || [];
      const files: File[] = [];
      if (thumbnail instanceof File) {
        files.push(thumbnail);
      }

      if (gallery && gallery.some((item: any) => item instanceof File)) {
        gallery.forEach((item: any) => {
          if (item instanceof File) {
            files.push(item);
          }
        });
      }
      if (files.length > 0) {
        const presignedUrls = await storageRequestApis.generatePresignedUrls({
          files: files.map((file) => ({
            fileName: file.name,
            fileType: file.type,
          })),
        });
        if (!presignedUrls?.payload?.data) {
          messageApi.error({
            error: presignedUrls.payload?.message || "Lỗi khi tạo URL",
          });
          return;
        }
        const uploadPromises = presignedUrls.payload.data.map(
          (presignedUrl, index) => {
            const file = files[index];
            return storageRequestApis.upload(presignedUrl.presignedUrl, file);
          }
        );
        const response = await Promise.all(uploadPromises);
        if (!response.every((res) => res.ok)) {
          messageApi.error({
            error: "Lỗi khi tải lên hình ảnh",
          });
          return;
        }
        thumbnail = presignedUrls.payload.data[0].fileUrl;
        gallery = gallery
          .filter((item: any) => !(item instanceof File))
          .concat(
            presignedUrls.payload.data.slice(1).map((item) => item.fileUrl)
          );
      }

      const requestData: CreateProductBodyType = {
        name: data.name,
        price: data.price,
        description: data.description,
        stock: data.stock,
        image: {
          thumbnail,
          gallery,
          banner: "",
          featured: "",
        },
        categoryId: data.category,
        tags: [],
        attributes: data.attributes,
        isFeatured: data.isFeatured || false,
        isBestSeller: data.isBestSeller || false,
        isPublished: data.isPublished || false,
        variants: data.variants,
      };

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

  const fillAttributes = useCallback(() => {
    const attributes = productDetail?.attributes?.reduce(
      (acc: any, attribute: any) => {
        if (categoryAttributeIds.includes(attribute.attributeId)) {
          acc[attribute.attributeId] = attribute.value;
        }
        return acc;
      },
      {}
    );
    form.setValue("attributes", attributes);
  }, [categoryAttributeIds, productDetail, form]);

  const fillVariants = useCallback(() => {
    const variants = productDetail?.variants.map((variant) => {
      return {
        name: variant.name,
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
        attributes: variant.attributes.reduce((acc: any, attribute: any) => {
          if (categoryAttributeIds.includes(attribute.attributeId)) {
            acc[attribute.attributeId] = attribute.value;
          }
          return acc;
        }, {}),
      };
    });
    console.log(variants);
    form.setValue("variants", variants);
  }, [categoryAttributeIds, productDetail, form]);

  useEffect(() => {
    if (!selectedCategory) return;
    loadAttributes(selectedCategory);
  }, [selectedCategory, form]);

  useEffect(() => {
    if (
      !selectedCategory ||
      !productDetail ||
      !categoryAttributes.length ||
      !form
    )
      return;
    fillAttributes();
    fillVariants();
  }, [
    fillAttributes,
    selectedCategory,
    productDetail,
    categoryAttributes,
    form,
    fillAttributes,
  ]);

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
