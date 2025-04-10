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
  getListOrders: () => {
    return http.get<GetListOrdersResponseType>("/order/list", {
      isPrivate: true,
    });
  },
};

export default orderRequestApis;
