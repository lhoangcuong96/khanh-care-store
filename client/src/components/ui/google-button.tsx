"use client";

import { authApiRequest } from "@/api-request/auth";
import { Button } from "@/components/ui/button";
import { routePath } from "@/constants/routes";
import sessionStore from "@/helper/local-store/session-store";
import { useToast } from "@/hooks/use-toast";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa6";

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleLoginButton() {
  const { toast } = useToast();
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => handleGoogleResponse(codeResponse),
    onError: () => {
      toast({
        title: "Đăng nhập thất bại",
        description: "Vui lòng thử lại",
        variant: "destructive",
        duration: 3000,
      });
    },
    flow: "auth-code",
  });

  const handleGoogleResponse = async (
    credentialResponse: Omit<
      CodeResponse,
      "error" | "error_description" | "error_uri"
    >
  ) => {
    try {
      console.log(credentialResponse);
      const res = await authApiRequest.authenticateWithGoogle(
        credentialResponse.code
      );
      const accessToken = res.payload?.data.accessToken;
      const refreshToken = res.payload?.data.refreshToken;
      if (!accessToken || !refreshToken) {
        throw new Error("Token không hợp lệ");
      }
      await authApiRequest.setToken(
        accessToken,
        refreshToken,
        res.payload?.data.account.id || ""
      );
      sessionStore.setTokens(
        accessToken,
        refreshToken,
        res.payload?.data.account.id || ""
      );
      toast({
        title: "Đăng nhập thành công",
        description: "Đăng nhập thành công",
        variant: "success",
        duration: 3000,
      });
      router.push(routePath.customer.home);
    } catch (_error) {
      console.error(_error);
      toast({
        title: "Đăng nhập thất bại",
        description: "Vui lòng thử lại",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <Button
      className="w-16 h-16 rounded-3xl bg-red-100 text-red-600 hover:bg-red-200"
      type="button"
      onClick={login}
    >
      <FaGoogle />
    </Button>
  );
}
