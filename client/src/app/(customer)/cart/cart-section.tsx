"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
import QuantitySelector from "@/components/ui/quantity-selector";
import { routePath } from "@/constants/routes";
import useCart from "@/hooks/modules/use-cart";
import Link from "next/link";
import { useEffect } from "react";

export default function CartSection() {
  const {
    total,
    cart,
    isLoadingCart,
    handleGetCart,
    handleRemoveProductFromCart,
    handleUpdateCartItemQuantity,
  } = useCart();

  useEffect(() => {
    handleGetCart();
  }, []);

  const isDisabledCheckout = isLoadingCart || !cart || cart.items.length === 0;

  return (
    <div className="grid">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Thông tin sản phẩm</TableHead>
            <TableHead className="font-semibold">Đơn giá</TableHead>
            <TableHead className="font-semibold w-32">Số lượng</TableHead>
            <TableHead className="font-semibold text-right">
              Thành tiền
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoadingCart && (
            <TableRow>
              <TableCell colSpan={4}>
                <p className="text-center leading-10">
                  Đang tải dữ liệu giỏ hàng ...
                </p>
              </TableCell>
            </TableRow>
          )}
          {!isLoadingCart &&
            cart &&
            cart.items.length > 0 &&
            cart.items.map((item) => (
              <TableRow key={item.product.id}>
                <TableCell>
                  <div className="flex flex-col md:flex-row gap-4">
                    <Image
                      src={item.product.image.thumbnail || "/placeholder.svg"}
                      alt={item.product.name}
                      width={80}
                      height={60}
                      className="rounded-lg"
                    />
                    <div>
                      <div className="font-medium">{item.product.name}</div>
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button
                            variant="link"
                            className="p-0 text-lime-600 underline"
                          >
                            Xóa
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Xác nhận xóa sản phẩm
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ
                              hàng không?
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
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.product.price.toLocaleString()}đ</TableCell>
                <TableCell>
                  <QuantitySelector
                    id={item.product.id}
                    quantity={item.quantity}
                    onUpdateQuantity={(id: string, quantity: number) => {
                      handleUpdateCartItemQuantity({
                        productId: id,
                        quantity,
                      });
                    }}
                  ></QuantitySelector>
                </TableCell>
                <TableCell className="text-right">
                  {(item.product.price * item.quantity).toLocaleString()}đ
                </TableCell>
              </TableRow>
            ))}
          {!isLoadingCart && (!cart || cart.items.length === 0) && (
            <TableRow>
              <TableCell colSpan={4}>
                <p className="text-center leading-10">Giỏ hàng trống</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-end mt-4">
        <div className="text-base font-semibold">
          Tổng tiền: {total.toLocaleString()}đ
        </div>
      </div>
      <Link
        href={
          isDisabledCheckout
            ? "#"
            : routePath.customer.checkout.deliveryInformation
        }
        className="justify-self-end"
      >
        <Button className="w-40 mt-4 bg-lime-600" disabled={isDisabledCheckout}>
          Thanh toán
        </Button>
      </Link>
    </div>
  );
}
