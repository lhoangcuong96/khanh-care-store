import DeliveryForm from "./delivery-form";
import { ChevronRight } from "lucide-react";

export default function CreateDeliveryPage() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
        <span>Quản lý giao hàng</span>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-gray-700">Tạo đơn hàng mới</span>
      </div>
      <div className="space-y-4 p-8">
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
          <span className="text-2xl font-bold text-gray-700">
            Tạo đơn hàng mới
          </span>
        </div>
        <DeliveryForm />
      </div>
    </div>
  );
}
