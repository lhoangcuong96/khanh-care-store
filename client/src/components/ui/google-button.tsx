"use client";

import { authApiRequest } from "@/api-request/auth";
import { Button } from "@/components/ui/button";
import { routePath } from "@/constants/routes";
import envConfig from "@/envConfig";
import sessionStore from "@/helper/local-store/session-store";
import { useHandleMessage } from "@/hooks/use-handle-message";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaGoogle } from "react-icons/fa6";

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleLoginButton() {
  const { messageApi } = useHandleMessage();
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleLogin = () => {
    try {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: envConfig?.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          ux_mode: "popup",
        });

        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // The Google Sign-In popup was closed or skipped
            if (notification.getSkippedReason() === "unknown_reason") {
              messageApi.error({
                error:
                  "Google Sign-In đã bị chặn, hãy vui lòng click icon dấu chấm than bên cạnh thanh địa chỉ và nhấn reset permission để có thể đăng nhập",
              });
            }
          }
        });
      }
    } catch (error) {
      messageApi.error({ error: (error as Error).message });
    }
  };

  const handleGoogleResponse = async (response: any) => {
    const { credential } = response;

    try {
      const res = await authApiRequest.authenticateWithGoogle(credential);
      const accessToken = res.payload?.data.accessToken;
      const refreshToken = res.payload?.data.refreshToken;
      if (!accessToken || !refreshToken) {
        throw new Error("Token không hợp lệ");
      }
      await authApiRequest.setToken(accessToken, refreshToken);
      sessionStore.setTokens(accessToken, refreshToken);
      messageApi.success({ description: "Đăng nhập thành công" });
      router.push(routePath.customer.home);
    } catch (_error) {
      console.error(_error);
      messageApi.error({ error: "Đăng nhập thất bại" });
    }
  };

  return (
    <Button
      className="w-16 h-16 rounded-3xl bg-red-100 text-red-600 hover:bg-red-200"
      type="button"
      onClick={handleGoogleLogin}
    >
      <FaGoogle />
    </Button>
  );
}
