import AppBreadcrumb from "@/components/customer/layout/breadcrumb";
import { Metadata } from "next";
import { SignUpForm } from "./sign-up-form";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Đăng Ký | Dollar Organic",
    description:
      "Đăng kí tài khoản của bạn để khám phá và mua sắm các sản phẩm sạch, an toàn và chất lượng cao.",
  };
};

export default function SignIn() {
  console.log("Sign up page");
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <AppBreadcrumb
        pageTitle="Đăng ký tài khoản"
        breadcrumbItems={[
          {
            title: "Trang chủ",
          },
          {
            title: "Đăng ký tài khoản",
          },
        ]}
      ></AppBreadcrumb>
      <div className="max-w-[500px] w-screen p-8">
        <h3 className="text-3xl font-semibold text-center mb-5">ĐĂNG KÝ</h3>
        <SignUpForm></SignUpForm>
      </div>
    </div>
  );
}
