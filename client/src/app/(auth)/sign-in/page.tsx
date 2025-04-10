import AppBreadcrumb from "@/components/customer/layout/breadcrumb";
import { Metadata } from "next";
import { SignInForm } from "./sign-in-form";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Đăng Nhập | Dollar Organic",
    description:
      "Đăng nhập vào tài khoản của bạn để khám phá và mua sắm các sản phẩm sạch, an toàn và chất lượng cao.",
  };
};

export default function SignIn() {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <AppBreadcrumb
        pageTitle="Đăng nhập tài khoản"
        breadcrumbItems={[
          {
            title: "Trang chủ",
          },
          {
            title: "Đăng nhập tài khoản",
          },
        ]}
      ></AppBreadcrumb>
      <div className="max-w-[500px] w-screen p-8">
        <h3 className="text-3xl font-semibold text-center mb-5">ĐĂNG NHẬP</h3>
        <SignInForm></SignInForm>
      </div>
    </div>
  );
}
