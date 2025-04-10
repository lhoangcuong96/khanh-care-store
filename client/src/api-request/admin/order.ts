import { http } from "@/lib/http";
import { GetListOrdersResponseType } from "@/validation-schema/admin/order";

export const adminOrderRequestApi = {
  list: () => {
    return http.get<GetListOrdersResponseType>(`/admin/orders`, {
      isAdminRequest: true,
      isPrivate: true,
    });
  },
};
