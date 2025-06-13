/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { authApiRequest } from "@/api-request/auth";
import { routePath } from "@/constants/routes";
import SessionStore from "@/helper/local-store/session-store";
import useCart from "@/hooks/modules/use-cart";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Page() {
  const router = useRouter();
  const { toast } = useToast();
  const { clearCart } = useCart();
  const signOut = async () => {
    try {
      await authApiRequest.logoutFromClientToNextServer({ forceLogout: true });
      SessionStore.clearTokens();
      clearCart();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Lỗi khi đăng xuất",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      router.replace(`${routePath.signIn}`);
      router.refresh();
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
