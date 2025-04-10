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
      console.log("orders", orders);
    } else {
      errorMessage = "Không tìm thấy dữ liệu";
    }
  } catch (error) {
    errorMessage = "Có lỗi xảy ra";
    console.log("error", error);
  }
  return (
    <div className="p-4">
      <OrderTable orders={orders} errorMessage={errorMessage}></OrderTable>
    </div>
  );
}
