"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { adminProductApiRequest } from "@/api-request/admin/product";
import { storageRequestApis } from "@/api-request/storage";
import { Button } from "@/components/ui/button";
import { useHandleMessage } from "@/hooks/use-handle-message";
import {
  CreateProductBodyType,
  ProductCreationFormSchema,
  ProductCreationFormValues,
  ProductDetailType,
} from "@/validation-schema/admin/product";
import BasicInfo from "./basic-info";
import SaleInfo from "./sale-info";
import Link from "next/link";
import { routePath } from "@/constants/routes";
import { useState } from "react";

export function ProductForm({
  productDetail,
}: {
  productDetail?: ProductDetailType;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { messageApi } = useHandleMessage();

  const form = useForm<ProductCreationFormValues>({
    resolver: zodResolver(ProductCreationFormSchema),
    defaultValues: {
      name: productDetail?.name || "",
      category: productDetail?.category?.id || "",
      description: productDetail?.description || "",
      isBestSeller: productDetail?.isBestSeller || false,
      isFeatured: productDetail?.isFeatured || false,
      price: productDetail?.price || 0,
      stock: productDetail?.stock || 0,
      thumbnail: productDetail?.image.thumbnail || "",
      weight: productDetail?.attributes.weight || 0,
    },
    mode: "all",
  });

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
      isFeatured: data.isFeatured,
      isBestSeller: data.isBestSeller,
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
            className="grid grid-cols-[2fr_1fr] gap-5"
          >
            <BasicInfo />
            <SaleInfo />
            <div className="flex justify-end gap-4 py-7 px-3 sticky bottom-0 bg-white shadow-xl col-span-2">
              <Link href={routePath.admin.product.list}>
                <Button type="button" variant="outline">
                  Hủy
                </Button>
              </Link>

              <Button type="submit" variant="secondary">
                Lưu & Ẩn
              </Button>
              <Button type="submit">Lưu & Hiển thị</Button>
            </div>
          </form>
        </div>
      </FormProvider>
    </div>
  );
}
