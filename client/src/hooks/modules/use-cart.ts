/* eslint-disable @typescript-eslint/no-unused-vars */
import { cartRequestApis } from "@/api-request/cart";
import { routePath } from "@/constants/routes";
import { useAppContext } from "@/provider/app-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "../use-toast";

export default function useCart() {
  const { cart, account, setCart } = useAppContext();
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const total =
    cart?.items.reduce((acc, item) => {
      return acc + item.quantity * item.product.price;
    }, 0) || 0;

  const countItems = cart?.items.length || 0;

  const handleGetCart = async () => {
    try {
      setIsLoadingCart(true);
      const resp = await cartRequestApis.getCart();
      const cart = resp.payload?.data;
      if (!cart) {
        throw new Error("Có lỗi xảy ra trong quá trình lấy giỏ hàng");
      }
      setCart(cart);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: (error as Error).message,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoadingCart(false);
    }
  };

  const handleAddToCart = async (
    productId: string,
    variantId?: string | null,
    quantity: number = 1
  ) => {
    if (!account) {
      router.push(`${routePath.signIn}?redirect=${location.pathname}`);
      return;
    }

    try {
      const resp = await cartRequestApis.addProductToCart({
        productId,
        variantId,
        quantity,
      });
      const cart = resp.payload?.data;
      if (!cart) {
        throw new Error(
          "Có lỗi xảy ra trong quá trình thêm sản phẩm vào giỏ hàng"
        );
      }
      setCart(cart);
      toast({
        title: "Thành công",
        description: "Thêm sản phẩm vào giỏ hàng thành công",
        variant: "success",
        duration: 1000,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: (error as Error).message,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleBuyNow = async (
    productId: string,
    variantId?: string | null,
    quantity: number = 1
  ) => {
    await handleAddToCart(productId, variantId, quantity);
    router.push(`${routePath.customer.cart}`);
  };

  const handleUpdateCartItemQuantity = async ({
    productId,
    quantity,
  }: {
    productId: string;
    quantity: number;
  }) => {
    if (!cart) return;

    try {
      await cartRequestApis.updateCartItemQuantity({ productId, quantity });
      // Update the actual cart state after successful API call
      setCart((prevCart) => {
        if (!prevCart) return prevCart;
        return {
          ...prevCart,
          items: prevCart.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        };
      });
      toast({
        title: "Thành công",
        description: "Cập nhật số lượng sản phẩm thành công",
        variant: "success",
        duration: 1000,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Lỗi cập nhật số lượng sản phẩm",
        variant: "destructive",
        duration: 3000,
      });
      // The optimistic state will be automatically reverted by React
    }
  };

  const handleRemoveProductFromCart = async (productId: string) => {
    if (!cart) return;

    try {
      await cartRequestApis.removeProductFromCart(productId);
      // Update the actual cart state after successful API call
      setCart((prevCart) => {
        if (!prevCart) return prevCart;
        return {
          ...prevCart,
          items: prevCart.items.filter((item) => item.product.id !== productId),
        };
      });
      toast({
        title: "Thành công",
        description: "Xóa sản phẩm khỏi giỏ hàng thành công",
        variant: "success",
        duration: 1000,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Lỗi xóa sản phẩm khỏi giỏ hàng",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const clearCart = () => {
    setCart({
      items: [],
      updatedAt: new Date(),
    });
  };

  return {
    cart,
    setCart,
    isLoadingCart,
    total,
    countItems,
    handleAddToCart,
    handleBuyNow,
    handleUpdateCartItemQuantity,
    handleRemoveProductFromCart,
    handleGetCart,
    clearCart,
  };
}
