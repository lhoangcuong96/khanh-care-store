import { http } from "@/lib/http";
import {
  GetListOrdersQueryType,
  GetListOrdersResponseType,
} from "@/validation-schema/admin/order";

export const adminOrderRequestApi = {
  list: (params: GetListOrdersQueryType) => {
    const queryParams = new URLSearchParams();
    if (params.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params.limit) {
      queryParams.append("limit", params.limit.toString());
    }
    if (params.status) {
      queryParams.append("status", params.status);
    }
    if (params.search) {
      queryParams.append("search", params.search);
    }
    if (params.orderBy) {
      queryParams.append("orderBy", params.orderBy);
    }
    if (params.order) {
      queryParams.append("order", params.order);
    }
    const queryString = queryParams.toString();
    const url = `/admin/orders?${queryString}`;
    return http.get<GetListOrdersResponseType>(url, {
      isAdminRequest: true,
      isPrivate: true,
    });
  },
};
