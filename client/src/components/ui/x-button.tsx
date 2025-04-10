"use client";

import { useHandleMessage } from "@/hooks/use-handle-message";
import { useGoogleLogin } from "@react-oauth/google";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from "./button";

const XButton = () => {
  const { messageApi } = useHandleMessage();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => console.log(codeResponse),
    onError: () => {
      messageApi.error({ error: "Đăng nhập thất bại" });
    },
    flow: "auth-code",
  });

  return (
    <Button
      className="w-16 h-16 rounded-3xl bg-stone-100 text-stone-600 hover:bg-stone-200"
      type="button"
      onClick={login}
    >
      <FaXTwitter className="!w-5 !h-5" />
    </Button>
  );
};

export default XButton;
