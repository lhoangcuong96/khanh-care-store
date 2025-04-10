import { Button } from "@/components/ui/button";
import { Card as Card2 } from "@/components/ui/card";
import { Heart } from "lucide-react";

import { ProductDetailType } from "@/validation-schema/product";
import Image from "next/image";
import AddToCart from "./add-to-cart";

export function ProductInfo({ product }: { product: ProductDetailType }) {
  return (
    <div className="space-y-6">
      <ProductHeader productName={product.name} />
      <ProductPrice productPrice={product.price} />
      <AddToCart id={product.id}></AddToCart>
      <ProductPromotions />
    </div>
  );
}

function ProductHeader({ productName }: { productName: string }) {
  return (
    <div className="flex items-start justify-between">
      <h1 className="text-2xl font-semibold text-lime-600">{productName}</h1>
      <Button variant="ghost" size="icon">
        <Heart className="w-6 h-6" />
      </Button>
    </div>
  );
}

function ProductPrice({ productPrice }: { productPrice: number }) {
  return (
    <div className="bg-[#f3fce8] p-4 rounded-lg">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-lime-600">
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
      <h3 className="font-semibold text-sm flex items-center gap-2 bg-lime-600 w-fit mb-0 text-white py-1 px-4 rounded-md rounded-b-none">
        <Image
          src="/images/icons/giftbox.webp"
          alt="Giftbox"
          width={30}
          height={30}
        />
        Khuyến mãi đặc biệt !!!
      </h3>
      <Card2 className="p-4 border-lime-700 rounded-tl-none">
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
