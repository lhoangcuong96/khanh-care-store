import AppBreadcrumb from "@/components/customer/layout/breadcrumb";
import { ReactNode } from "react";
import { LeftSidebar } from "./left-sidebar";
import NavigationTabs from "./navigation-tabs";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col w-full items-center justify-center h-full">
      <AppBreadcrumb
        pageTitle="Trang khách hàng"
        breadcrumbItems={[
          {
            title: "Trang chủ",
          },
          {
            title: "Trang khách hàng",
          },
        ]}
      ></AppBreadcrumb>
      <div className="w-screen p-8 flex items-center justify-center h-full">
        <div className="max-w-screen-xl w-full">
          <div className="mx-auto">
            <div className="flex flex-col gap-6 lg:flex-row lg:min-h-[600px] h-full font-medium">
              <LeftSidebar />
              <NavigationTabs />
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
