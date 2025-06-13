"use client";

import { Button } from "@/components/ui/button";
import { Card as Card2 } from "@/components/ui/card";
import { Heart } from "lucide-react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ProductDetailType } from "@/validation-schema/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CartAction from "./cart-action";

export function ProductInfo({ product }: { product: ProductDetailType }) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(product.price);

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0].id);
      setCurrentPrice(product.variants[0].price);
    }
  }, [product.variants]);

  const variant = product.variants?.find((v) => v.id === selectedVariant);

  return (
    <div className="flex flex-col md:flex-row gap-0 md:gap-0">
      <div className="md:w-1/2 md:max-w-[450px] w-full bg-slate-50 flex flex-col items-center justify-center p-6 ">
        <ProductImages images={product.image.gallery || []} />
      </div>
      <div className="md:w-1/2 w-full flex flex-col bg-white md:p-6 pt-4 md:pt-0 space-y-6 ">
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
        <CartAction
          id={product.id}
          quantity={1}
          variantId={selectedVariant}
          stock={
            product.variants && product.variants.length > 0
              ? variant?.stock
              : product.stock
          }
        ></CartAction>
      </div>
    </div>
  );
}

export function ProductHeader({ productName }: { productName: string }) {
  return (
    <div className="flex items-start justify-between">
      <h1 className="text-2xl font-semibold text-slate-600">{productName}</h1>
      <Button variant="ghost" size="icon" className="!w-9 !h-9">
        <Heart className="w-6 h-6" />
      </Button>
    </div>
  );
}

export function ProductVariant({
  product,
  selectedVariant,
  onVariantChange,
}: {
  product: ProductDetailType;
  selectedVariant: string | null;
  onVariantChange: (id: string, price: number) => void;
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
          const variant = product.variants?.find((v) => v.id === value);
          if (variant) {
            onVariantChange(variant.id, variant.price);
          }
        }}
        className="flex flex-wrap gap-2"
      >
        {product.variants?.map((variant) => (
          <div key={variant.id} className="flex items-center">
            <RadioGroupItem
              value={variant.id}
              id={variant.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={variant.id}
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
        <ProductStock
          stock={
            product.variants.find((v) => v.id === selectedVariant)?.stock || 0
          }
        />
      )}
    </div>
  );
}

export function ProductPrice({ productPrice }: { productPrice: number }) {
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

export function ProductStock({ stock }: { stock: number }) {
  return (
    <div className="text-sm mt-2">
      {stock > 0 ? (
        <span className="text-muted-foreground">Còn lại: {stock} sản phẩm</span>
      ) : (
        <span className="text-muted-foreground">Hết hàng</span>
      )}
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
            Tặng 100.000đ mua hàng tại website thành viên KCS
          </li>
        </ul>
      </Card2>
    </div>
  );
}

export function ProductImages({ images }: { images: string[] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Main Image Swiper */}
      <Swiper
        modules={[Thumbs]}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        spaceBetween={10}
        slidesPerView={1}
        className="rounded-lg mb-4"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <div className="flex items-center justify-center aspect-square bg-white">
              <Image
                src={img}
                alt={`Product Image ${idx + 1}`}
                width={400}
                height={400}
                className="object-cover rounded-lg max-w-[400px] max-h-[400px] w-full h-full"
                priority={idx === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Thumbnails Swiper with custom arrows */}
      <div className="relative">
        <Swiper
          modules={[Navigation, Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={Math.min(images.length, 4)}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          watchSlidesProgress
          className="rounded-lg"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="w-24 h-24 flex items-center justify-center border-2 rounded cursor-pointer">
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  width={96}
                  height={96}
                  className="object-cover rounded"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          ref={prevRef}
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 shadow w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          <ChevronLeft className="w-6 h-6 text-gray-500" />
        </button>
        <button
          ref={nextRef}
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 shadow w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          <ChevronRight className="w-6 h-6 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
