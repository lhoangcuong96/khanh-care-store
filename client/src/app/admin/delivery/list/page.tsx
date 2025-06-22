import AdminDeliveryRequestApis from "@/api-request/admin/delivery";
import { DeliveryInListType } from "@/validation-schema/admin/delivery";
import DeliveryTable from "./delivery-table";
import { Order } from "@/validation-schema/common";
import { ChevronRight } from "lucide-react";

export default async function DeliveryListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let deliveries: DeliveryInListType[] = [];
  let errorMessage = "";
  const params = await searchParams;
  let total = 0;
  let totalPages = 1;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const search = (params.search as string) || "";
  const orderBy = (params.orderBy as string) || "createdAt";
  const order = (params.order as string) || Order.Desc;
  const status = (params.status as string) || "";
  const deliveryDate = (params.deliveryDate as string) || "";

  try {
    const response = await AdminDeliveryRequestApis.list({
      page: page.toString(),
      limit: limit.toString(),
      search,
      orderBy,
      order,
      status,
      deliveryDate,
    });
    if (response.payload?.data) {
      deliveries = response.payload.data;
      total = response.payload.total;
      totalPages = response.payload.totalPages;
    } else {
      errorMessage = "Không tìm thấy dữ liệu";
    }
  } catch (error) {
    errorMessage = (error as Error).message || "Có lỗi xảy ra";
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
        <span>Quản lý giao hàng</span>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-gray-700">Tất cả giao hàng</span>
      </div>
      <div className="space-y-4 p-8">
        <DeliveryTable
          searchTerm={search}
          statusFilter={status}
          deliveryDateFilter={deliveryDate}
          deliveries={deliveries}
          errorMessage={errorMessage}
          total={total}
          page={page}
          limit={limit}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
