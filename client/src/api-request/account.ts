import { http } from "@/lib/http";
import {
  AccountResponseType,
  ChangePasswordBodyType,
  UpdateProfileBodyType,
  UpdateShippingAddressBodyType,
} from "@/validation-schema/account";
import { MessageResponseType } from "@/validation-schema/common";

export const accountApiRequest = {
  getMe: async () =>
    http.get<AccountResponseType>("/account/me", {
      isPrivate: true,
    }),

  updateShippingAddress: async (data: UpdateShippingAddressBodyType) => {
    return http.put<AccountResponseType>("/account/shipping-address", data, {
      isPrivate: true,
    });
  },
  updateProfile: async (data: UpdateProfileBodyType) => {
    return http.put<AccountResponseType>("/account/me", data, {
      isPrivate: true,
    });
  },
  changePassword: async (data: ChangePasswordBodyType) => {
    return http.post<MessageResponseType>("/account/change-password", data, {
      isPrivate: true,
    });
  },
};
