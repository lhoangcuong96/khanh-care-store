"use client";

import { authApiRequest } from "@/api-request/auth";
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
import { SignUpRequestDataType, signUpSchema } from "@/validation-schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-dropdown-menu";

import { accountApiRequest } from "@/api-request/account";
import { cartRequestApis } from "@/api-request/cart";
import { useAppContext } from "@/provider/app-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export function SignUpForm() {
  const { messageApi } = useHandleMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { setAccount, setCart } = useAppContext();

  const { control, handleSubmit, setError, formState } =
    useForm<SignUpRequestDataType>({
      resolver: zodResolver(signUpSchema),
      defaultValues: {
        fullname: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      mode: "all",
    });

  const onSubmit = async (data: SignUpRequestDataType) => {
    setIsSubmitting(true);
    try {
      const response = await authApiRequest.register(data);
      const accessToken = response.payload?.data.accessToken;
      const refreshToken = response.payload?.data.refreshToken;
      if (!accessToken || !refreshToken) {
        throw new Error("Token không hợp lệ");
      }
      // Send token to client server to set cookie
      await authApiRequest.setToken(accessToken, refreshToken);
      messageApi.success({
        description: "Đăng kí thành công",
      });
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
      router.push(routePath.customer.home);
      router.refresh();
    } catch (error) {
      messageApi.error({ error: error as Error, setError });
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(formState.errors);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col max-w-[500px] w-full"
    >
      <div className="mb-4">
        <Controller
          control={control}
          name="fullname"
          render={({ field, fieldState: { error } }) => (
            <>
              <FormInput
                {...field}
                placeholder="Họ và tên"
                error={error?.message}
              />
              {error?.message && <FormError error={error.message} />}
            </>
          )}
        />
      </div>

      <div className="mb-4">
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field, fieldState: { error } }) => (
            <>
              <FormInput
                {...field}
                placeholder="Số điện thoại"
                className="w-full"
                type="tel"
                error={error?.message}
              />
              {error?.message && <FormError error={error.message} />}
            </>
          )}
        />
      </div>
      {/* <div className="mb-4">
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState: { error } }) => (
            <>
              <FormInput
                {...field}
                placeholder="Email"
                className="w-full"
                type="email"
                formNoValidate
                error={error?.message}
                value={field.value || ""}
              />
              {error?.message && <FormError error={error.message} />}
            </>
          )}
        />
      </div> */}

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

      <div className="mb-4">
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field, fieldState: { error } }) => (
            <>
              <FormInput.Password
                {...field}
                placeholder="Nhập lại mật khẩu"
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
          {isSubmitting ? <Spinner /> : "Đăng kí"}
        </DefaultButton>
      </div>

      <Link
        href={routePath.signIn}
        className="text-green-600 underline hover:text-green-600 hover:underline block m-auto font-semibold"
      >
        Đăng nhập
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
