import { adminOrderRequestApi } from "@/api-request/admin/order";
import { OrderInListDataType } from "@/validation-schema/admin/order";
import OrderTable from "./order-table";

export default async function OrderPage() {
  let orders: OrderInListDataType[] = [];
  let errorMessage = "";
  try {
    const response = await adminOrderRequestApi.list();
    if (response.payload?.data) {
      orders = response.payload.data;
    } else {
      errorMessage = "Không tìm thấy dữ liệu";
    }
  } catch (error) {
    errorMessage = (error as Error).message || "Có lỗi xảy ra";
  }
  return (
    <div className="p-4">
      <OrderTable orders={orders} errorMessage={errorMessage}></OrderTable>
    </div>
  );
}
