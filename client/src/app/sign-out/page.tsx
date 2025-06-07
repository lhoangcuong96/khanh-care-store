"use client";

import { authApiRequest } from "@/api-request/auth";
import { routePath } from "@/constants/routes";
import SessionStore from "@/helper/local-store/session-store";
import { useHandleMessage } from "@/hooks/use-handle-message";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Page() {
  const { messageApi } = useHandleMessage();
  const router = useRouter();
  const signOut = async () => {
    try {
      await authApiRequest.logoutFromClientToNextServer({ forceLogout: true });
      SessionStore.clearTokens();
    } catch (error) {
      messageApi.error({ error: error as Error });
    } finally {
      router.replace(`${routePath.signIn}`);
      // router.refresh();
    }
  };
  useEffect(() => {
    signOut();
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-700">
      <div className="animate-spin-y">
        <Image
          src="/images/logo.png"
          alt="Loading spinner"
          width="124"
          height="39"
        />
      </div>
    </div>
  );
}
