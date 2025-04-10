/* eslint-disable prefer-const */
"use client";

import { FaFacebookF } from "react-icons/fa";
import { Button } from "./button";
import { useEffect, useState } from "react";
import { useHandleMessage } from "@/hooks/use-handle-message";
import { authApiRequest } from "@/api-request/auth";
import sessionStore from "@/helper/local-store/session-store";
import { useRouter } from "next/navigation";
import { routePath } from "@/constants/routes";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: any;
  }
}

const FacebookButton = () => {
  const [isSdkLoaded, setSdkLoaded] = useState(false);
  const { messageApi } = useHandleMessage();
  const router = useRouter();

  useEffect(() => {
    if (typeof window.FB !== "undefined" && window.FB !== null) {
      setSdkLoaded(true);
      return;
    }
    if (!isSdkLoaded) {
      loadFacebookSdk();
    }
  }, [isSdkLoaded]);

  const loadFacebookSdk = () => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: 628387887806587,
        cookie: true,
        xfbml: true,
        version: "v12.0",
      });
      setSdkLoaded(true);
    };

    (function (d, s, id) {
      let js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode!.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  };

  const handleLogin = () => {
    if (!isSdkLoaded) {
      messageApi.error({ error: "Facebook SDK not loaded" });
      return;
    }

    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          verifyToken(response.authResponse.accessToken);
        } else {
          messageApi.error({ error: "Facebook login failed" });
        }
      },
      { scope: "email" }
    );
  };

  const verifyToken = async (token: string) => {
    try {
      const res = await authApiRequest.authenticateWithFacebook(token);
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
      className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-600 hover:bg-slate-200"
      type="button"
      onClick={handleLogin}
      disabled={!isSdkLoaded}
    >
      <FaFacebookF className="!w-5 !h-5" />
    </Button>
  );
};

export default FacebookButton;
