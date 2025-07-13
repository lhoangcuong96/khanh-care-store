import { http } from "@/lib/http";
import {
  CreateOrderBodyType,
  CreateOrderResponseType,
  GetListOrdersResponseType,
  GetOrderResponseType,
} from "@/validation-schema/order";

const orderRequestApis = {
  createOrder: (data: CreateOrderBodyType) => {
    return http.post<CreateOrderResponseType>("/order/create", data, {
      isPrivate: true,
    });
  },
  getOrder: (orderCode: string) => {
    return http.get<GetOrderResponseType>(`/order/get/${orderCode}`, {
      isPrivate: true,
    });
  },
  getListOrders: (searchTerm?: string, status?: string) => {
    const queryParams = new URLSearchParams();
    if (searchTerm) {
      queryParams.set("search", searchTerm);
    }
    if (status) {
      queryParams.set("status", status);
    }
    return http.get<GetListOrdersResponseType>(
      `/order/list?${queryParams.toString()}`,
      {
        isPrivate: true,
      }
    );
  },
};

export default orderRequestApis;
