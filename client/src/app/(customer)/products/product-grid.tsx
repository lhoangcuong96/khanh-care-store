"use client";

import { ProductCard } from "@/components/customer/UI/card/product-card";
import { ProductInListType } from "@/validation-schema/product";

export default function ProductGrid({
  initialProducts,
  errorMessage,
}: {
  initialProducts: ProductInListType[];
  errorMessage?: string;
}) {
  if (errorMessage) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <p className="text-rose-600">{errorMessage}</p>
      </div>
    );
  }
  if (!errorMessage && initialProducts.length === 0) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <p className="text-rose-600">Không tìm thấy sản phẩm nào</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
      {initialProducts.map((product) => {
        return <ProductCard product={product} key={product.id}></ProductCard>;
      })}
    </div>
  );
}
