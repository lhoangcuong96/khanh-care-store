import AppBreadcrumb from "@/components/customer/layout/breadcrumb";
import Promotions from "@/components/ui/promotions";
import { routePath } from "@/constants/routes";
import CartSection from "./cart-section";

export default function CartPage() {
  return (
    <div className="flex flex-col w-full items-center justify-center h-full text-sm font-medium">
      <AppBreadcrumb
        pageTitle="Giỏ hàng"
        breadcrumbItems={[
          {
            title: "Trang chủ",
            href: routePath.customer.home,
          },
          {
            title: "Giỏ hàng",
          },
        ]}
      ></AppBreadcrumb>
      <div className="w-screen p-8 flex items-center justify-center h-full">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Server-side rendered section */}
          <Promotions />

          {/* Client-side rendered section */}
          <CartSection />
        </div>
      </div>
    </div>
  );
}
