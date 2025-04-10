import { http } from "@/lib/http";
import {
  RefreshTokenResponseDataType,
  SignInRequestDataType,
  SignInResponseType,
  SignUpRequestDataType,
  SignUpResponseDataType,
  SocialAuthResponseType,
} from "@/validation-schema/auth";
import { MessageResponseType } from "@/validation-schema/common";

export const authApiRequest = {
  login: (data: SignInRequestDataType) =>
    http.post<SignInResponseType>("/auth/login", data),
  register: (data: SignUpRequestDataType) =>
    http.post<SignUpResponseDataType>("/auth/register", data),
  // lấy token từ server nodejs gửi lên server nextjs để set cookie
  setToken: (accessToken: string, refreshToken: string) =>
    http.post(
      "/api/auth",
      {
        accessToken,
        refreshToken,
      },
      {
        baseUrl: "",
      }
    ),
  logoutFromClientToNextServer: ({
    forceLogout = false,
  }: {
    forceLogout?: boolean;
  }) =>
    http.post<MessageResponseType>(
      "/api/auth/sign-out",
      { forceLogout },
      {
        baseUrl: "",
      }
    ),
  logoutFromNextServerToApiServer: (accessToken: string) =>
    http.post<MessageResponseType>(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),
  refreshTokenFromClientToNextServer: () =>
    http.post<RefreshTokenResponseDataType>(
      "/api/auth/refresh-token",
      {},
      {
        baseUrl: "",
      }
    ),
  refreshTokenFromNextServerToApiServer: (
    accessToken: string,
    refreshToken: string
  ) =>
    http.post<RefreshTokenResponseDataType>(
      "/auth/refresh-token",
      {
        refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),

  authenticateWithGoogle: (token: string) => {
    return http.post<SocialAuthResponseType>("/auth/google", { token });
  },
  authenticateWithFacebook: (token: string) => {
    return http.post<SocialAuthResponseType>("/auth/facebook", { token });
  },
};
