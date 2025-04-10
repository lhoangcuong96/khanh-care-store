import { Button } from "@/components/ui/button";
import { routePath } from "@/constants/routes";
import { formatCurrency } from "@/helper";

import { Card } from "@/components/ui/card";
import useCart from "@/hooks/modules/use-cart";
import { ProductInListType } from "@/validation-schema/product";
import { Heart, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ProductCard({ product }: { product: ProductInListType }) {
  const { handleAddToCart } = useCart();

  const promotionalPrice = product.promotionPercent
    ? product.price - (product.price * product.promotionPercent) / 100
    : 0;
  return (
    <Card className="w-full max-w-40 md:max-w-56 p-3 rounded-lg relative gap-1 m-[2px] shadow hover:outline-2 hover:outline-lime-600 hover:outline">
      <Link
        className="w-full h-full flex flex-col gap-1"
        href={`${routePath.customer.productDetail}/${product.slug}`}
      >
        {product.isPromotion && (
          <div className="absolute -left-[1px] -top-[1px] bg-red-500 text-white px-3 py-1 text-sm rounded-br-lg rounded-tl-lg z-50">
            <p>Giảm {product.promotionPercent}%</p>
          </div>
        )}

        <Image
          src={product?.image?.thumbnail || ""}
          alt={product.name || ""}
          height={148}
          width={198}
          className="m-auto"
        ></Image>
        <h3
          className="font-semibold hover:text-lime-600 h-12"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: "2",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {product.name}
        </h3>
        <div className="flex flex-row gap-2 items-center">
          <p className="text-lime-600 font-semibold">
            {formatCurrency(product.price || 0)}
          </p>
          {product.isPromotion && (
            <p className="line-through text-xs">
              {formatCurrency(promotionalPrice)}
            </p>
          )}
        </div>
        {/* <AppProgress /> */}
        <p className="font-semibold text-sm">Đã bán: 136</p>
      </Link>

      <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 bg-lime-600 text-white hover:bg-lime-600"
          onClick={() => handleAddToCart(product.id!)}
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 bg-lime-600 text-white hover:bg-lime-600"
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 bg-lime-600 text-white hover:bg-lime-600"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
