"use client";

import Link from "next/link";
import { FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { routePath } from "@/constants/routes";
import { type ProductDetailType } from "@/validation-schema/admin/product";
import ProductAttributes from "./product-attributes";
import ProductBasicInfo from "./product-basic-info";
import ProductVariantInfo from "./product-variant-info";
import { useHandleForm } from "./useHandleForm";

export function ProductForm({
  productDetail,
}: {
  productDetail?: ProductDetailType;
}) {
  const {
    isLoading,
    error,
    categoryAttributes,
    form,
    selectedCategory,
    onSubmit,
    isSubmitting,
  } = useHandleForm({
    productDetail,
  });

  return (
    <div className="flex">
      <FormProvider {...form}>
        <div className="flex-1 p-6">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <ProductBasicInfo />
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

              <Button
                type="submit"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => {
                  form.setValue("isPublished", false);
                  form.handleSubmit(onSubmit)();
                }}
              >
                {isSubmitting ? "Đang lưu..." : "Lưu & Ẩn"}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={() => {
                  form.setValue("isPublished", true);
                  form.handleSubmit(onSubmit)();
                }}
              >
                {isSubmitting ? "Đang lưu..." : "Lưu & Hiển thị"}
              </Button>
            </div>
          </form>
        </div>
      </FormProvider>
    </div>
  );
}
