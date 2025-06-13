"use client";

import AddToCart from "@/app/(customer)/product-detail/[slug]/cart-action";
import {
  ProductHeader,
  ProductImages,
  ProductPrice,
  ProductStock,
  ProductVariant,
} from "@/app/(customer)/product-detail/[slug]/product-info";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { ProductDetailType } from "@/validation-schema/product";
import { useEffect, useState } from "react";

export default function ProductDetailModal({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product: ProductDetailType | null;
}) {
  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(product.price);

  useEffect(() => {
    console.log("product.variants", product.variants);
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0].id);
      setCurrentPrice(product.variants[0].price);
    }
  }, [product.variants]);

  const variant = product.variants?.find((v) => v.id === selectedVariant);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-4xl w-screen p-0 overflow-hidden rounded-2xl">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="flex flex-col md:flex-row gap-0 md:gap-0">
          <div className="md:w-1/2 md:max-w-[450px] w-full bg-slate-50 flex flex-col items-center justify-center p-6 ">
            <ProductImages images={product.image.gallery || []} />
          </div>
          <div className="md:w-1/2 w-full flex flex-col bg-white p-6 space-y-6 ">
            <ProductHeader productName={product.name} />
            <ProductPrice productPrice={currentPrice} />
            {product.variants && product.variants.length === 0 && (
              <ProductStock stock={product.stock || 0} />
            )}

            {product.variants && product.variants.length > 0 && (
              <ProductVariant
                product={product}
                selectedVariant={selectedVariant}
                onVariantChange={(id, price) => {
                  setSelectedVariant(id);
                  setCurrentPrice(price);
                }}
              />
            )}
            <AddToCart
              id={product.id}
              quantity={1}
              variantId={selectedVariant}
              stock={
                product.variants && product.variants.length > 0
                  ? variant?.stock
                  : product.stock
              }
            ></AddToCart>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
