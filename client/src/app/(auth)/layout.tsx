import { Footer } from "@/components/customer/layout/footer";
import Header from "@/components/customer/layout/header";
import { routePath } from "@/constants/routes";
import envConfig from "@/envConfig";
import { Account } from "@prisma/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PayloadJWT } from "../api/auth/route";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  let account: Partial<Account> | undefined;
  if (accessToken) {
    const tokenPayload = jwtDecode<PayloadJWT>(accessToken);
    account = tokenPayload?.account;
  }

  if (account) redirect(routePath.customer.home);
  return (
    <div className="bg-white min-h-screen max-w-screen overflow-hidden h-full flex flex-col items-center">
      <GoogleOAuthProvider
        clientId={envConfig?.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
      >
        <Header></Header>
        <div className="min-h-[600px] max-w-screen w-full">{children}</div>
        <Footer></Footer>
      </GoogleOAuthProvider>
    </div>
  );
}
