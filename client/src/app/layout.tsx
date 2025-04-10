import AppProvider from "@/provider/app-provider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";

import { accountApiRequest } from "@/api-request/account";
import { cartRequestApis } from "@/api-request/cart";
import { categoryApiRequests } from "@/api-request/category";
import FacebookMessengerChat from "@/components/ui/facebook-message-chat";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReactQueryProvider from "@/provider/react-query-provider";
import { AccountType } from "@/validation-schema/account";
import { CartType } from "@/validation-schema/cart";
import { cookies } from "next/headers";
import "swiper/css";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: {
    template: "%s | KCS - Khánh Care Store",
    default: "KCS - Khánh Care Store",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    const res = await categoryApiRequests.getListCategory();
    if (!res.payload?.data) throw new Error("Không thể lấy danh sách danh mục");
    return res.payload.data;
  };

  const [getUserResponse, getListCategoryResponse] = await Promise.allSettled([
    accessToken ? getUserMe() : Promise.resolve(null),
    getListCategory(),
  ]);
  if (getUserResponse.status === "rejected") {
    console.error(getUserResponse.reason);
  }
  if (getListCategoryResponse.status === "rejected") {
    console.error(getListCategoryResponse.reason);
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
          initialAccount={
            getUserResponse.status === "fulfilled"
              ? getUserResponse.value?.account
              : undefined
          }
          initialCart={
            getUserResponse.status === "fulfilled"
              ? getUserResponse.value?.cart
              : undefined
          }
          initialCategories={
            getListCategoryResponse.status === "fulfilled"
              ? getListCategoryResponse.value
              : undefined
          }
        >
          <ReactQueryProvider>
            <TooltipProvider>
              <AntdRegistry>{children}</AntdRegistry>
            </TooltipProvider>
          </ReactQueryProvider>
        </AppProvider>
        <FacebookMessengerChat />
      </body>
    </html>
  );
}
