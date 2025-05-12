"use client";

import { Button } from "@/components/ui/button";
import { Card as Card2 } from "@/components/ui/card";
import { Heart } from "lucide-react";

import type { ProductDetailType } from "@/validation-schema/product";
import Image from "next/image";
import AddToCart from "./add-to-cart";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export function ProductInfo({ product }: { product: ProductDetailType }) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(product.price);

  console.log(product); // Set the first variant as default if variants exist
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0].sku);
      setCurrentPrice(product.variants[0].price);
    }
  }, [product.variants]);

  return (
    <div className="space-y-6">
      <ProductHeader productName={product.name} />
      <ProductPrice productPrice={currentPrice} />
      {product.variants && product.variants.length > 0 && (
        <ProductVariant
          product={product}
          selectedVariant={selectedVariant}
          onVariantChange={(sku, price) => {
            setSelectedVariant(sku);
            setCurrentPrice(price);
          }}
        />
      )}
      <AddToCart
        id={product.id}
        variantSku={selectedVariant}
        quantity={1}
      ></AddToCart>
      <ProductPromotions />
    </div>
  );
}

function ProductHeader({ productName }: { productName: string }) {
  return (
    <div className="flex items-start justify-between">
      <h1 className="text-2xl font-semibold text-slate-600">{productName}</h1>
      <Button variant="ghost" size="icon">
        <Heart className="w-6 h-6" />
      </Button>
    </div>
  );
}

function ProductVariant({
  product,
  selectedVariant,
  onVariantChange,
}: {
  product: ProductDetailType;
  selectedVariant: string | null;
  onVariantChange: (sku: string, price: number) => void;
}) {
  // Format attributes for display if they exist
  const formatVariantName = (variant: ProductDetailType["variants"][0]) => {
    if (!variant.attributes || Object.keys(variant.attributes).length === 0) {
      return variant.name;
    }

    // If there are attributes, we can show them in a more readable format
    const attributeText = Object.entries(variant.attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");

    return variant.name || attributeText;
  };

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Loại</h3>
      <RadioGroup
        value={selectedVariant || ""}
        onValueChange={(value) => {
          const variant = product.variants?.find((v) => v.sku === value);
          if (variant) {
            onVariantChange(variant.sku, variant.price);
          }
        }}
        className="flex flex-wrap gap-2"
      >
        {product.variants?.map((variant) => (
          <div key={variant.sku} className="flex items-center">
            <RadioGroupItem
              value={variant.sku}
              id={variant.sku}
              className="peer sr-only"
            />
            <Label
              htmlFor={variant.sku}
              className="flex items-center justify-between px-3 py-2 border rounded-md cursor-pointer peer-data-[state=checked]:bg-slate-600 peer-data-[state=checked]:text-white peer-data-[sta`te=checked]:border-primary"
            >
              <span>{formatVariantName(variant)}</span>
              {variant.price !== product.price && (
                <span className="ml-2 text-sm peer-data-[state=checked]:text-white">
                  {variant.price.toLocaleString()}₫
                </span>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {/* Show stock information for selected variant */}
      {selectedVariant && product.variants && (
        <div className="text-sm mt-2">
          <span className="text-muted-foreground">
            Còn lại:{" "}
            {product.variants.find((v) => v.sku === selectedVariant)?.stock ||
              0}{" "}
            sản phẩm
          </span>
        </div>
      )}
    </div>
  );
}

function ProductPrice({ productPrice }: { productPrice: number }) {
  return (
    <div className="bg-[#f3fce8] p-4 rounded-lg">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-600">
          {productPrice.toLocaleString()}₫
        </span>
        {/* <span className="text-sm line-through text-muted-foreground">
          14.000₫
        </span> */}
      </div>
      {/* <div className="text-sm text-red-500">Tiết kiệm: 4100₫</div> */}
    </div>
  );
}

export function ProductPromotions() {
  return (
    <div>
      <h3 className="font-semibold text-sm flex items-center gap-2 bg-slate-600 w-fit mb-0 text-white py-1 px-4 rounded-md rounded-b-none">
        <Image
          src="/images/icons/giftbox.webp"
          alt="Giftbox"
          width={30}
          height={30}
        />
        Khuyến mãi đặc biệt !!!
      </h3>
      <Card2 className="p-4 border-slate-700 rounded-tl-none">
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Image
              src="/images/icons/km_product2.webp"
              alt="Giftbox"
              width={15}
              height={15}
            />
            Áp dụng Phiếu quà tặng/ Mã giảm giá theo loại sản phẩm
          </li>
          <li className="flex items-center gap-2">
            <Image
              src="/images/icons/km_product2.webp"
              alt="Giftbox"
              width={15}
              height={15}
            />
            Giảm giá 10% khi mua từ 5 sản phẩm trở lên
          </li>
          <li className="flex items-center gap-2">
            <Image
              src="/images/icons/km_product3.webp"
              alt="Giftbox"
              width={15}
              height={15}
            />
            Tặng 100.000đ mua hàng tại website thành viên Heo sach nhà Thoa
          </li>
        </ul>
      </Card2>
    </div>
  );
}
