import { Button } from "@/components/ui/button";
import { routePath } from "@/constants/routes";
import { formatCurrency } from "@/helper";

import { Card } from "@/components/ui/card";
import useCart from "@/hooks/modules/use-cart";
import { ProductInListType } from "@/validation-schema/product";
import { Heart, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ProductCard({
  product,
  onSearchClick,
  handleAddToFavorite,
  handleRemoveFromFavorite,
}: {
  product: ProductInListType;
  onSearchClick?: () => void;
  handleAddToFavorite: (id: string) => void;
  handleRemoveFromFavorite: (id: string) => void;
}) {
  const { handleAddToCart } = useCart();

  const promotionalPrice = product?.promotionPercent
    ? product?.price - (product?.price * product?.promotionPercent) / 100
    : 0;
  return (
    <Card className="w-full max-w-64 md:max-w-64 p-3 rounded-xl relative gap-2 m-[2px] shadow-lg hover:shadow-2xl hover:scale-[1.025] transition-all duration-200 bg-white border border-slate-100">
      <Link
        className="w-full flex flex-col gap-2"
        href={`${routePath.customer.productDetail}/${product?.slug}`}
      >
        <div
          className="relative w-full flex items-center justify-center bg-slate-100 rounded-lg overflow-hidden"
          style={{ width: 200, height: 130, margin: "0 auto" }}
        >
          {product?.isPromotion && (
            <span className="absolute left-2 top-2 bg-red-500 text-white px-2 py-0.5 text-xs rounded shadow z-10 font-semibold animate-pulse">
              -{product?.promotionPercent}%
            </span>
          )}
          {product?.image?.thumbnail ? (
            <Image
              src={product?.image?.thumbnail}
              alt={product?.name || ""}
              width={200}
              height={130}
              className="object-cover w-[200px] h-[130px] rounded-lg"
            />
          ) : (
            <div className="w-[200px] h-[130px] flex items-center justify-center text-slate-400 text-2xl">
              No Image
            </div>
          )}
        </div>
        <h3
          className="font-semibold hover:text-slate-700 h-12 text-base md:text-lg leading-tight mt-1 mb-0.5"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: "2",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {product?.name}
        </h3>
        <div className="flex flex-row gap-2 items-end mt-1 mb-0.5">
          {product?.isPromotion ? (
            <>
              <span className="text-lg font-bold text-red-500">
                {formatCurrency(promotionalPrice)}
              </span>
              <span className="line-through text-xs text-slate-400">
                {formatCurrency(product?.price || 0)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-slate-700">
              {formatCurrency(product?.price || 0)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
            Đã bán: {product.sold}
          </span>
        </div>
      </Link>
      <div className="flex flex-row gap-2 justify-center items-center mt-3 border-t pt-2 bg-white z-10">
        <Button
          size="icon"
          variant="secondary"
          className="h-9 w-9 bg-slate-700 text-white hover:bg-slate-900 border border-slate-200 shadow-sm transition-colors"
          onClick={() => {
            if (product.variants && product.variants.length > 0) {
              onSearchClick?.();
            } else {
              handleAddToCart(product.id!);
            }
          }}
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-9 w-9 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 shadow-sm"
          onClick={onSearchClick}
        >
          <Search className="h-9 w-5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-9 w-9 bg-slate-100 text-slate-700 hover:bg-pink-100 border border-slate-200 shadow-sm"
          onClick={() => {
            if (product.isFavorite) {
              handleRemoveFromFavorite(product.id!);
            } else {
              handleAddToFavorite(product.id!);
            }
          }}
        >
          <Heart
            className={`h-5 w-5 ${
              product.isFavorite ? "text-pink-500 fill-pink-500" : ""
            }`}
          />
        </Button>
      </div>
    </Card>
  );
}
