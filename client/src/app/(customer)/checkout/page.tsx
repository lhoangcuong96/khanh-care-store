import AppBreadcrumb from "@/components/customer/layout/breadcrumb";
import { routePath } from "@/constants/routes";
import DeliveryInformation from "./delivery-information";
import { cartRequestApis } from "@/api-request/cart";

export default async function CartPage() {
  const getUserCartResp = await cartRequestApis.getCart();
  const cart = getUserCartResp.payload?.data;
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
          {!cart || cart.items.length === 0 ? (
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Giỏ hàng trống</h2>
              <p className="text-gray-500 mt-4">
                Bạn chưa có sản phẩm nào trong giỏ hàng
              </p>
            </div>
          ) : (
            <DeliveryInformation cart={cart} />
          )}
        </div>
      </div>
    </div>
  );
}
