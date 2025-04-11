"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import QuantitySelector from "@/components/ui/quantity-selector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import useCart from "@/hooks/modules/use-cart";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { routePath } from "@/constants/routes";

export function CartPopup() {
  const {
    cart,
    total,
    handleRemoveProductFromCart,
    handleUpdateCartItemQuantity,
  } = useCart();
  const items = cart?.items || [];

  return (
    <div className="w-[400px] bg-white rounded-lg shadow-lg p-4 font-semibold text-sm">
      <ScrollArea className="h-[300px] pr-4">
        {items.length > 0 &&
          items.map((item) => (
            <div key={item.product.id} className="mb-4">
              <div className="flex gap-3">
                <Image
                  src={item.product.image.thumbnail || "/placeholder.svg"}
                  alt={item.product.name}
                  width={80}
                  height={60}
                  className="rounded-md object-contain"
                />
                <div className="flex flex-col flex-1 gap-1">
                  <h3 className="font-bold">{item.product.name}</h3>
                  <AlertDialog>
                    <AlertDialogTrigger
                      className="text-red-500 hover:text-red-700 w-fit"
                      type="button"
                    >
                      Xóa
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Xác nhận xóa sản phẩm
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng
                          không?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleRemoveProductFromCart(item.product.id)
                          }
                        >
                          Tiếp tục
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">Số lượng</div>
                    <div className="text-right mt-1 font-medium text-lime-600">
                      {item.product.price.toLocaleString()}đ
                    </div>
                  </div>
                  <QuantitySelector
                    quantity={item.quantity}
                    onUpdateQuantity={(id: string, quantity: number) => {
                      handleUpdateCartItemQuantity({
                        productId: id,
                        quantity,
                      });
                    }}
                    id={item.product.id}
                    className="w-28"
                  ></QuantitySelector>
                </div>
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
        {items.length === 0 && (
          <div className="text-center h-full w-full flex items-center justify-center">
            Không có sản phẩm nào trong giỏ hàng
          </div>
        )}
      </ScrollArea>

      <div className="mt-4 flex items-center justify-between font-medium">
        <span>Tổng tiền:</span>
        <span className="text-lime-600">{total.toLocaleString()}đ</span>
      </div>

      <Link href={routePath.customer.checkout.deliveryInformation}>
        <Button className="w-full mt-4 bg-lime-600 hover:bg-lime-700">
          Thanh toán
        </Button>
      </Link>
    </div>
  );
}
