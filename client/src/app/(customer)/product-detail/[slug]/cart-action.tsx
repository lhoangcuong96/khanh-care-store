"use client";

import { Button } from "@/components/ui/button";
import QuantitySelector from "@/components/ui/quantity-selector";
import useCart from "@/hooks/modules/use-cart";
import { useState } from "react";
import { IoCartOutline } from "react-icons/io5";

export default function CartAction({
  id,
  variantId,
  stock,
  quantity: initialQuantity = 1,
}: {
  id: string;
  variantId?: string | null;
  quantity?: number;
  stock?: number;
}) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const { handleAddToCart, handleBuyNow } = useCart();
  return (
    <>
      <QuantitySelector
        id={id}
        quantity={quantity}
        onUpdateQuantity={(id, quantity) => {
          setQuantity(quantity);
        }}
        className="w-28"
      />
      <Button
        className="w-full bg-slate-600 hover:bg-slate-600 flex flex-row h-fit disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => handleAddToCart(id, variantId, quantity)}
        disabled={stock === 0}
      >
        <IoCartOutline className="!w-8 !h-8"></IoCartOutline>
        <div className="flex flex-col w-full">
          <p className="font-semibold">THÊM VÀO GIỎ</p>
          <p className="font-normal">Giao hàng tận nơi</p>
        </div>
      </Button>
      <Button
        className="w-full h-14 bg-rose-600 hover:bg-rose-600 flex flex-row disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => handleBuyNow(id, variantId, quantity)}
        disabled={stock === 0}
      >
        <div className="flex flex-col w-full">
          <p className="font-semibold">MUA HÀNG NGAY</p>
        </div>
      </Button>
    </>
  );
}
