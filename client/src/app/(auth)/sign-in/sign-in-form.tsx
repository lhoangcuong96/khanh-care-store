"use client";

import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { accountApiRequest } from "@/api-request/account";
import { authApiRequest } from "@/api-request/auth";
import { cartRequestApis } from "@/api-request/cart";
import DefaultButton from "@/components/customer/UI/button/default-button";
import { FormError } from "@/components/customer/UI/input/form/form-error";
import FormInput from "@/components/customer/UI/input/form/input";
import FacebookButton from "@/components/ui/facebook-button";
import GoogleButton from "@/components/ui/google-button";
import Spinner from "@/components/ui/spinner";
import XButton from "@/components/ui/x-button";
import { routePath } from "@/constants/routes";
import SessionStore from "@/helper/local-store/session-store";
import { useHandleMessage } from "@/hooks/use-handle-message";
import { useAppContext } from "@/provider/app-provider";
import { SignInRequestDataType, signInSchema } from "@/validation-schema/auth";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const { messageApi } = useHandleMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { setAccount, setCart } = useAppContext();

  const { control, handleSubmit, setError } = useForm<SignInRequestDataType>({
    resolver: zodResolver(signInSchema),
    mode: "all",
  });

  const onSubmit = async (data: SignInRequestDataType) => {
    setIsSubmitting(true);
    try {
      const response = await authApiRequest.login(data);
      const accessToken = response.payload?.data.accessToken;
      const refreshToken = response.payload?.data.refreshToken;

      if (!accessToken || !refreshToken) {
        throw new Error("Token không hợp lệ");
      }

      // Send token to client server to set cookie
      await authApiRequest.setToken(accessToken, refreshToken);
      SessionStore.setTokens(accessToken, refreshToken);
      const getMeResponse = await accountApiRequest.getMe();
      const account = getMeResponse.payload?.data;
      if (!account) {
        throw new Error("Có lỗi xảy ra trong quá trình đăng kí");
      }
      setAccount(account);
      const getUserCartResp = await cartRequestApis.getCart();
      const cart = getUserCartResp.payload?.data;
      if (!cart) {
        throw new Error("Có lỗi xảy ra trong quá trình lấy giỏ hàng");
      }
      setCart(cart);
      messageApi.success({
        title: "Thành công",
        description: "Đăng nhập thành công",
      });
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("redirect")) {
        const redirectPath = urlParams.get("redirect");
        if (redirectPath) {
          router.push(redirectPath);
          router.refresh();
          return;
        }
      }
      router.push(routePath.customer.home);
      router.refresh();
    } catch (error) {
      messageApi.error({ error: error as Error, setError });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col max-w-[500px] w-full"
    >
      <div className="mb-4">
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field, fieldState: { error } }) => (
            <>
              <FormInput
                {...field}
                onChange={field.onChange}
                onBlur={field.onBlur}
                value={field.value}
                placeholder="Số điện thoại"
                className="w-full"
                // type="email"
                formNoValidate
                error={error?.message}
                type="number"
              />
              {error?.message && <FormError error={error.message} />}
            </>
          )}
        />
      </div>

      <div className="mb-4">
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState: { error } }) => (
            <>
              <FormInput.Password
                {...field}
                placeholder="Mật khẩu"
                className="w-full"
                formNoValidate
                error={error?.message}
              />
              {error?.message && <FormError error={error.message} />}
            </>
          )}
        />
      </div>

      <div className="self-center w-fit mb-4">
        <DefaultButton
          type="submit"
          disabled={isSubmitting}
          className="uppercase"
        >
          {isSubmitting ? <Spinner /> : "Đăng nhập"}
        </DefaultButton>
      </div>

      <Link
        href={routePath.signUp}
        className="text-green-600 underline hover:text-green-600 hover:underline block m-auto font-semibold"
      >
        Quên mật khẩu
      </Link>
      <Link
        href={routePath.signUp}
        className="text-green-600 underline hover:text-green-600 hover:underline block m-auto font-semibold"
      >
        Đăng kí
      </Link>
      <Separator className="my-4" />
      <p className="text-center">Hoặc đăng nhập bằng</p>
      <div className="w-full flex justify-center space-x-4 my-4">
        <GoogleButton />
        <FacebookButton />
        <XButton />
      </div>
    </form>
  );
}
