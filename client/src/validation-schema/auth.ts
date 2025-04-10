import { TokenType } from "@/constants/types";
import { z } from "zod";

export const signInSchema = z.object({
  phoneNumber: z
    .string({
      required_error: "Xin vui lòng nhập số điện thoại!",
    })
    .regex(
      new RegExp("^(0[1-9]{1}[0-9]{8})$|^(84[1-9]{1}[0-9]{8})$"),
      "Số điện thoại không đúng!"
    ),
  password: z.string({
    required_error: "Xin vui lòng nhập mật khẩu!",
  }),
  remember: z.boolean().optional(),
});

export const signInResponseSchema = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    account: z.object({
      id: z.string(),
      fullname: z.string(),
      email: z.string(),
    }),
  }),
  message: z.string(),
});

export const signUpSchema = z
  .object({
    fullname: z.string().min(1, "Xin vui lòng nhập họ và tên!"),
    phoneNumber: z
      .string()
      .regex(
        new RegExp("^(0[1-9]{1}[0-9]{8})$|^(84[1-9]{1}[0-9]{8})$"),
        "Số điện thoại không đúng!"
      ),
    email: z
      .string()
      .email("Email không đúng!")
      .optional()
      .or(z.literal(""))
      .or(z.null()),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 kí tự!")
      .max(100, "Mật khẩu có nhiều nhất 100 kí tự!"),
    confirmPassword: z.string().min(1, "Xin vui lòng nhập mật khẩu!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không trùng khớp!",
    path: ["confirmPassword"],
  });

export const signUpResponseType = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    account: z.object({
      id: z.string(),
      fullname: z.string(),
      email: z.string(),
    }),
  }),
  message: z.string(),
});

// client gửi accessToken và refreshToken lên server để set lại cookie
export const setCookieSchema = z
  .object({
    [TokenType.AccessToken]: z.string(),
    [TokenType.RefreshToken]: z.string(),
  })
  .strict();

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});
export const refreshTokenResponseType = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
  message: z.string(),
});

export type SignInRequestDataType = z.infer<typeof signInSchema>;
export type SignInResponseType = z.infer<typeof signInResponseSchema>;

export type SignUpRequestDataType = z.infer<typeof signUpSchema>;
export type SignUpResponseDataType = z.infer<typeof signUpResponseType>;

export type SetCookieRequestDataType = z.infer<typeof setCookieSchema>;

export type RefreshTokenRequestDataType = z.infer<typeof refreshTokenSchema>;
export type RefreshTokenResponseDataType = z.infer<
  typeof refreshTokenResponseType
>;

/*--------------------------------Social auth-------------------------------------*/
export const socialAuthSchema = z.object({
  token: z.string(),
});

export type SocialAuthRequestDataType = z.infer<typeof socialAuthSchema>;
export type SocialAuthResponseType = z.infer<typeof signInResponseSchema>;
