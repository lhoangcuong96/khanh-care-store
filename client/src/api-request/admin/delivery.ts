import { http } from "@/lib/http";
import {
  CreateDeliveryBodyType,
  CreateDeliveryResponseType,
  DeleteDeliveryResponseType,
  GetDeliveryDetailResponseType,
  GetListDeliveriesQueryType,
  GetListDeliveriesResponseType,
  UpdateDeliveryBodyType,
  UpdateDeliveryResponseType,
} from "@/validation-schema/admin/delivery";

const AdminDeliveryRequestApis = {
  // Create new delivery
  create: (data: CreateDeliveryBodyType) => {
    return http.post<CreateDeliveryResponseType>("/admin/delivery", data, {
      isAdminRequest: true,
      isPrivate: true,
    });
  },

  // Get list of deliveries
  list: (params: GetListDeliveriesQueryType) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.status) searchParams.append("status", params.status);
    if (params.search) searchParams.append("search", params.search);
    if (params.orderBy) searchParams.append("orderBy", params.orderBy);
    if (params.order) searchParams.append("order", params.order);
    if (params.deliveryDate)
      searchParams.append("deliveryDate", params.deliveryDate);

    return http.get<GetListDeliveriesResponseType>(
      `/admin/delivery?${searchParams.toString()}`,
      {
        isAdminRequest: true,
        isPrivate: true,
      }
    );
  },

  // Get delivery detail
  getById: (id: string) => {
    return http.get<GetDeliveryDetailResponseType>(`/admin/delivery/${id}`, {
      isAdminRequest: true,
      isPrivate: true,
    });
  },

  // Update delivery
  update: (id: string, data: UpdateDeliveryBodyType) => {
    return http.put<UpdateDeliveryResponseType>(`/admin/delivery/${id}`, data, {
      isAdminRequest: true,
      isPrivate: true,
    });
  },

  // Delete delivery
  delete: (id: string) => {
    return http.delete<DeleteDeliveryResponseType>(`/admin/delivery/${id}`, {
      isAdminRequest: true,
      isPrivate: true,
    });
  },

  // Update delivery status
  updateStatus: (id: string, status: string) => {
    return http.put<UpdateDeliveryResponseType>(
      `/admin/delivery/${id}/status`,
      { status },
      {
        isAdminRequest: true,
        isPrivate: true,
      }
    );
  },

  // Get delivery by order ID
  getByOrderId: (orderId: string) => {
    return http.get<GetDeliveryDetailResponseType>(
      `/admin/delivery/order/${orderId}`,
      {
        isAdminRequest: true,
        isPrivate: true,
      }
    );
  },
};

export default AdminDeliveryRequestApis;
