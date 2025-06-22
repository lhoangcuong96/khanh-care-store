import { adminOrderRequestApi } from "@/api-request/admin/order";
import { OrderInListDataType } from "@/validation-schema/admin/order";
import OrderTable from "./order-table";
import { Order } from "@/validation-schema/common";

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let orders: OrderInListDataType[] = [];
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

  try {
    const response = await adminOrderRequestApi.list({
      page: page.toString(),
      limit: limit.toString(),
      search,
      orderBy,
      order,
      status,
    });
    if (response.payload?.data) {
      orders = response.payload.data;
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
      <OrderTable
        searchTerm={search}
        statusFilter={status}
        orders={orders}
        errorMessage={errorMessage}
        total={total}
        page={page}
        limit={limit}
        totalPages={totalPages}
      ></OrderTable>
    </div>
  );
}
