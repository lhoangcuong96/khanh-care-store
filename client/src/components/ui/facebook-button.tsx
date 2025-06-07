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
import Spinner from "./spinner";
import envConfig from "@/envConfig";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: any;
  }
}

const FacebookButton = () => {
  const [isSdkLoaded, setSdkLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    if (!envConfig || !envConfig?.NEXT_PUBLIC_FACEBOOK_APP_ID) {
      messageApi.error({ error: "Facebook app ID not found" });
      return;
    }
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: envConfig!.NEXT_PUBLIC_FACEBOOK_APP_ID,
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
    setIsLoading(true);
    if (!isSdkLoaded) {
      messageApi.error({ error: "Facebook SDK not loaded" });
      return;
    }

    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          verifyToken(response.authResponse.accessToken);
        } else {
          console.log("Facebook login failed", response);
          messageApi.error({ error: "Facebook login failed" });
        }
        setIsLoading(false);
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
      router.refresh();
    } catch (_error) {
      console.error(_error);
      messageApi.error({ error: "Đăng nhập thất bại" });
    }
  };

  return (
    <Button
      className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-600 hover:bg-slate-200 relative"
      type="button"
      onClick={handleLogin}
      disabled={!isSdkLoaded || isLoading}
    >
      {isLoading && (
        <Spinner className="!w-5 !h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}
      <FaFacebookF className="!w-5 !h-5" />
    </Button>
  );
};

export default FacebookButton;
