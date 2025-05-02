"use client";

import Link from "next/link";
import { useState } from "react";
import { FormProvider } from "react-hook-form";

import { adminProductApiRequest } from "@/api-request/admin/product";
import { storageRequestApis } from "@/api-request/storage";
import { Button } from "@/components/ui/button";
import { routePath } from "@/constants/routes";
import { useHandleMessage } from "@/hooks/use-handle-message";
import {
  type CreateProductBodyType,
  type ProductDetailType,
} from "@/validation-schema/admin/product";
import ProductAttributes from "./product-attributes";
import ProductBasicInfo from "./product-basic-info";
import ProductVariantInfo from "./product-variant-info";
import { ProductCreationFormValues, useHandleForm } from "./useHandleForm";

export function ProductForm({
  productDetail,
}: {
  productDetail?: ProductDetailType;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { messageApi } = useHandleMessage();

  const { isLoading, error, categoryAttributes, form, selectedCategory } =
    useHandleForm();

  const onSubmit = async (data: ProductCreationFormValues) => {
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
      attributes: {
        weight: data.weight,
        origin: "Việt Nam",
      },
      isFeatured: data.isFeatured || false,
      isBestSeller: data.isBestSeller || false,
      // variants:
      //   data.variants?.map((variant) => ({
      //     name: variant.name,
      //     sku: variant.sku,
      //     price: variant.price,
      //     stock: variant.stock,
      //     attributes: {
      //       volume: variant.attributes.volume,
      //       type: variant.attributes.type,
      //     },
      //   })) || [],
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
        form.reset();
      }
    } catch (e) {
      messageApi.error({
        error: (e as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <FormProvider {...form}>
        <div className="flex-1 p-6">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <ProductBasicInfo productDetail={undefined} />
            <ProductAttributes
              isLoading={isLoading}
              error={error}
              categoryAttributes={categoryAttributes}
              selectedCategory={selectedCategory}
            />
            <ProductVariantInfo
              isLoading={isLoading}
              error={error}
              categoryAttributes={categoryAttributes}
              selectedCategory={selectedCategory}
            />
            <div className="flex justify-end gap-4 py-7 px-3 sticky bottom-0 bg-white shadow-xl col-span-2">
              <Link href={routePath.admin.product.list}>
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Hủy
                </Button>
              </Link>

              <Button type="submit" variant="secondary" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : "Lưu & Ẩn"}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : "Lưu & Hiển thị"}
              </Button>
            </div>
          </form>
        </div>
      </FormProvider>
    </div>
  );
}
