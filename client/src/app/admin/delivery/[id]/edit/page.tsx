import AdminDeliveryRequestApis from "@/api-request/admin/delivery";
import { Button } from "@/components/ui/button";
import { routePath } from "@/constants/routes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditDeliveryForm from "./edit-delivery-form";

export default async function EditDeliveryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let delivery = null;
  let errorMessage = "";

  try {
    const response = await AdminDeliveryRequestApis.getById(id);
    if (response.payload?.data) {
      delivery = response.payload.data;
    } else {
      errorMessage = "Không tìm thấy thông tin giao hàng";
    }
  } catch (error) {
    errorMessage = (error as Error).message || "Có lỗi xảy ra";
  }

  if (errorMessage || !delivery) {
    notFound();
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={routePath.admin.delivery.detail(id)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Chỉnh sửa giao hàng
            </h1>
            <p className="text-muted-foreground">
              Mã giao hàng: {delivery.deliveryCode}
            </p>
          </div>
        </div>
      </div>

      <EditDeliveryForm delivery={delivery} />
    </div>
  );
}
