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
    <div className="flex flex-col md:flex-row w-full">
      <FormProvider {...form}>
        <div className="flex-1mx-auto w-full">
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
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 py-4 px-2 sm:px-3 sticky bottom-0 bg-white shadow-xl w-full mx-auto z-10">
              <Link href={routePath.admin.product.list}>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Hủy
                </Button>
              </Link>
              <Button
                type="submit"
                variant="secondary"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
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
                className="w-full sm:w-auto"
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
