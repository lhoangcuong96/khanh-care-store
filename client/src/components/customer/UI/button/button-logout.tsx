"use client";

import { authApiRequest } from "@/api-request/auth";
import { ButtonProps } from "@/components/ui/button";
import { useHandleMessage } from "@/hooks/use-handle-message";
import { useRouter } from "next/navigation";
import DefaultButton from "./default-button";

export function ButtonLogout(
  props: ButtonProps & {
    className?: string;
  }
) {
  const { className, ...rest } = props;
  const { messageApi } = useHandleMessage();
  const router = useRouter();
  const handleLogOut = async () => {
    try {
      await authApiRequest.logoutFromClientToNextServer({ forceLogout: false });
      messageApi.success({
        description: "Đăng xuất thành công",
      });
    } catch (error) {
      messageApi.error({ error: error as Error });
    } finally {
      router.refresh();
    }
  };
  return (
    <DefaultButton {...rest} className={`${className}`} onClick={handleLogOut}>
      Đăng Xuất
    </DefaultButton>
  );
}
