import z from "zod";

export const ShippingAddressSchema = z.object({
  address: z.string(),
  district: z.string(),
  ward: z.string(),
  province: z.string(),
});

export const AccountSchema = z
  .object({
    id: z.string(),
    fullname: z.string(),
    email: z.string(),
    phoneNumber: z.string().nullable().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable().optional(),
    dateOfBirth: z
      .preprocess(
        (val) => (val instanceof Date ? val : new Date(val as string)),
        z.date()
      )
      .nullable()
      .optional(),
    avatar: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    shippingAddress: ShippingAddressSchema.nullable().optional(),
    role: z.enum(["USER", "ADMIN"]),
  })
  .strip();
export const AccountResponseSchema = z
  .object({
    data: AccountSchema,
    message: z.string(),
  })
  .strict();

export type ShippingAddressType = z.TypeOf<typeof ShippingAddressSchema>;

/* Get account me */
export type AccountType = z.TypeOf<typeof AccountSchema>;
export type AccountResponseType = z.TypeOf<typeof AccountResponseSchema>;

/* Get account me*/

/* Update account */
export const UpdateProfileBody = z.object({
  fullname: z
    .string()
    .trim()
    .min(2, "Họ và tên ít nhất 2 kí tự")
    .max(256, "Họ và tên nhiều nhất 256 kí tự"),
  phoneNumber: z
    .string()
    .regex(
      new RegExp("^(0[1-9]{1}[0-9]{8})$|^(84[1-9]{1}[0-9]{8})$"),
      "Số điện thoại không đúng!"
    ),
  address: z.string().optional(),
  avatar: z.string().nullable().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  dateOfBirth: z.union([z.date(), z.string()]),
});

export type UpdateProfileBodyType = z.TypeOf<typeof UpdateProfileBody>;
/* Update account */

/* Change password*/
export const ChangePasswordBody = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(6, "Mật khẩu mới ít nhất 6 kí tự"),
});

export type ChangePasswordBodyType = z.TypeOf<typeof ChangePasswordBody>;
/* Change password*/

/* Update shipping address */
export const UpdateShippingAddressBody = ShippingAddressSchema;

export type UpdateShippingAddressBodyType = z.TypeOf<
  typeof UpdateShippingAddressBody
>;
/* Update shipping address */
