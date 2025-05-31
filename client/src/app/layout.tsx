import AppProvider from "@/provider/app-provider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";

import { accountApiRequest } from "@/api-request/account";
import { cartRequestApis } from "@/api-request/cart";
import { categoryApiRequests } from "@/api-request/category";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReactQueryProvider from "@/provider/react-query-provider";
import { AccountType } from "@/validation-schema/account";
import { CartType } from "@/validation-schema/cart";
import { CategoryInListType } from "@/validation-schema/category";
import { cookies, headers } from "next/headers";
import "swiper/css";
import "./globals.css";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { redirect } from "next/navigation";
import { AuthError } from "@/lib/http";
import { routePath } from "@/constants/routes";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  // display swap để font không load được sẽ load 1 phông dự phòng
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: {
    template: "%s | KCS", // luôn luôn thêm suffix " | Dolar Organic" vào title
    default: "KCS", // Mặc định nếu trang không có title
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname =
    headersList.get("x-invoke-path") || headersList.get("x-pathname") || "";
  const isAuthPage =
    pathname.startsWith(routePath.signIn) ||
    pathname.startsWith(routePath.signUp) ||
    pathname.startsWith(routePath.signOut);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const getUserMe = async () => {
    let account: AccountType | undefined = undefined;
    let cart: CartType | undefined = undefined;
    const getMeResponse = await accountApiRequest.getMe();
    account = getMeResponse.payload?.data;
    if (account) {
      const getUserCartResp = await cartRequestApis.getCart();
      cart = getUserCartResp.payload?.data;
    }
    return { account, cart };
  };

  const getListCategory = async () => {
    try {
      const res = await categoryApiRequests.getListCategory();
      if (!res.payload?.data)
        throw new Error("Không thể lấy danh sách danh mục");
      return res.payload.data;
    } catch (error) {
      throw error;
    }
  };

  let userCart: CartType | undefined = undefined;
  let userAccount: AccountType | undefined = undefined;
  let categories: CategoryInListType[] | undefined = undefined;
  if (pathname !== routePath.signOut) {
    const [getUserResponse, getListCategoryResponse] = await Promise.allSettled(
      [
        !isAuthPage && accessToken ? getUserMe() : Promise.resolve(null),
        getListCategory(),
      ]
    );
    if (!isAuthPage && getUserResponse.status === "rejected") {
      if (getUserResponse.reason instanceof AuthError) {
        if (accessToken) {
          redirect("/sign-out");
        } else {
          redirect("/sign-in");
        }
      }
    }
    if (getListCategoryResponse.status === "fulfilled") {
      categories = getListCategoryResponse.value;
    }
    if (getListCategoryResponse.status === "rejected") {
      console.error(getListCategoryResponse.reason);
    }
    if (getUserResponse.status === "fulfilled") {
      userAccount = getUserResponse.value?.account;
      userCart = getUserResponse.value?.cart;
    }
  }

  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${quicksand.className} antialiased bg-white text-gray-700`}
      >
        <AppProvider
          initialAccount={userAccount}
          initialCart={userCart}
          initialCategories={categories}
        >
          <ReactQueryProvider>
            <TooltipProvider>
              <AntdRegistry>{children}</AntdRegistry>
            </TooltipProvider>
          </ReactQueryProvider>
          <ScrollToTop />
        </AppProvider>
      </body>
    </html>
  );
}
