"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useCart from "@/hooks/modules/use-cart";
import Image from "next/image";

export default function OrderSummary() {
  const deliveryCost = 0;

  const { cart, total, countItems } = useCart();

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
              <span>Phí vận chuyển</span>
              <span>{deliveryCost.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Tổng cộng</span>
              <span>{(total + deliveryCost).toLocaleString()}đ</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
