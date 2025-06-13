import AppBreadcrumb from "@/components/customer/layout/breadcrumb";
import { routePath } from "@/constants/routes";
import DeliveryInformation from "./delivery-information";
import { cartRequestApis } from "@/api-request/cart";
import { CartType } from "@/validation-schema/cart";

export default async function CartPage() {
  let cart: CartType | undefined = undefined;
  let errorMessage: string | undefined = undefined;
  try {
    const getUserCartResp = await cartRequestApis.getCart();
    cart = getUserCartResp.payload?.data;
    if (!cart) {
      errorMessage = "Không tìm thấy giỏ hàng";
    }
  } catch (error) {
    console.error(error);
    errorMessage = "Lỗi khi lấy giỏ hàng";
  }

  return (
    <div className="flex flex-col w-full items-center justify-center h-full text-sm font-medium">
      <AppBreadcrumb
        pageTitle="Thanh toán"
        breadcrumbItems={[
          {
            title: "Trang chủ",
            href: routePath.customer.home,
          },
          {
            title: "Thanh toán",
          },
        ]}
      ></AppBreadcrumb>
      <div className="w-screen p-8 flex items-center justify-center h-full">
        <div className="max-w-full lg:max-w-7xl mx-auto p-4 md:p-6">
          {errorMessage && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Lỗi</h2>
              <p className="text-red-500 mt-4">{errorMessage}</p>
            </div>
          )}
          {!errorMessage && cart && cart.items.length > 0 && (
            <DeliveryInformation cart={cart} />
          )}
          {!errorMessage && cart && cart.items.length === 0 && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Giỏ hàng trống</h2>
              <p className="text-gray-500 mt-4">
                Bạn chưa có sản phẩm nào trong giỏ hàng
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
