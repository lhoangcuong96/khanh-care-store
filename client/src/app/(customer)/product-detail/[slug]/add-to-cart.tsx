"use client";

import { Button } from "@/components/ui/button";
import QuantitySelector from "@/components/ui/quantity-selector";
import useCart from "@/hooks/modules/use-cart";
import { useState } from "react";
import { IoCartOutline } from "react-icons/io5";

export default function AddToCart({
  id,
  quantity: initialQuantity = 1,
}: {
  id: string;
  quantity?: number;
}) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const { handleAddToCart } = useCart();
  return (
    <>
      <QuantitySelector
        id={id}
        quantity={quantity}
        onUpdateQuantity={(id, quantity) => {
          setQuantity(quantity);
        }}
        className="w-32"
      />
      <Button
        className="w-full bg-slate-600 hover:bg-slate-600 flex flex-row h-fit"
        onClick={() => handleAddToCart(id, quantity)}
      >
        <IoCartOutline className="!w-8 !h-8"></IoCartOutline>
        <div className="flex flex-col w-full">
          <p className="font-semibold">THÊM VÀO GIỎ</p>
          <p className="font-normal">Giao hàng tận nơi</p>
        </div>
      </Button>
    </>
  );
}
