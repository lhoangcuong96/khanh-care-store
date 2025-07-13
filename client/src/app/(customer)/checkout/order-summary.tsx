"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useCart from "@/hooks/modules/use-cart";
import Image from "next/image";
import { Controller, useFormContext } from "react-hook-form";

export default function OrderSummary() {
  // TODO: get delivery cost from backend

  const { cart, total, countItems } = useCart();
  const { control, watch } = useFormContext();

  return (
    <div>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Đơn hàng ({countItems} sản phẩm)
        </h2>

        <div className="border-b pb-4 mb-4">
          {cart?.items.map((item) => (
            <div className="flex items-start gap-4" key={item.product.id}>
              <div className="relative w-20 h-20">
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  {item.quantity}
                </div>
                <Image
                  src={item.product.image.thumbnail}
                  alt={item.product.name}
                  width={80}
                  height={60}
                  className="rounded-md"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                {item.product.variant && (
                  <p className="text-sm text-gray-500">
                    {item.product.variant.name}
                  </p>
                )}
                <p className="mt-1">
                  {item.product.price.toLocaleString()}đ x {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Nhập mã giảm giá" />
            <Button variant="secondary">Áp dụng</Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{total.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between">
              <Controller
                control={control}
                name="shippingFee"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Phí vận chuyển"
                    className="hidden"
                  />
                )}
              />
              <span>Phí vận chuyển</span>
              <span>{watch("shippingFee").toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Tổng cộng</span>
              <span>{(total + watch("shippingFee")).toLocaleString()}đ</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
