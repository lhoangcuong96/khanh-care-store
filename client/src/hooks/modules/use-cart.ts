import { cartRequestApis } from "@/api-request/cart";
import { routePath } from "@/constants/routes";
import { useAppContext } from "@/provider/app-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useHandleMessage } from "../use-handle-message";

export default function useCart() {
  const { cart, account, setCart } = useAppContext();
  const { messageApi } = useHandleMessage();
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const router = useRouter();

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
      messageApi.error({
        error: (error as Error).message,
      });
    } finally {
      setIsLoadingCart(false);
    }
  };

  const handleAddToCart = async (productId: string, quantity: number = 1) => {
    if (!account) {
      router.push(`${routePath.signIn}?redirect=${location.pathname}`);
      return;
    }

    try {
      const resp = await cartRequestApis.addProductToCart({
        productId: productId,
        quantity,
      });
      const cart = resp.payload?.data;
      if (!cart) {
        throw new Error(
          "Có lỗi xảy ra trong quá trình thêm sản phẩm vào giỏ hàng"
        );
      }
      setCart(cart);
      messageApi.success({
        title: "Thành công",
        description: "Thêm sản phẩm vào giỏ hàng thành công",
      });
    } catch (error) {
      messageApi.error({
        error: (error as Error).message,
      });
    }
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
      messageApi.success({
        title: "Thành công",
        description: "Cập nhật số lượng sản phẩm thành công",
      });
    } catch (error) {
      console.error(error);
      messageApi.error({
        error: "Lỗi cập nhật số lượng sản phẩm",
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
      messageApi.success({
        title: "Thành công",
        description: "Xóa sản phẩm khỏi giỏ hàng thành công",
      });
    } catch (error) {
      console.error(error);
      messageApi.error({
        error: "Lỗi xóa sản phẩm khỏi giỏ hàng",
      });
    }
  };

  return {
    cart,
    setCart,
    isLoadingCart,
    total,
    countItems,
    handleAddToCart,
    handleUpdateCartItemQuantity,
    handleRemoveProductFromCart,
    handleGetCart,
  };
}
