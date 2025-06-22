import AdminDeliveryRequestApis from "@/api-request/admin/delivery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { routePath } from "@/constants/routes";
import { formatDate } from "date-fns";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const periodLabels = {
  morning: "Sáng",
  afternoon: "Chiều",
  evening: "Tối",
};

const statusLabels = {
  PENDING: "Chờ giao hàng",
  IN_TRANSIT: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  FAILED: "Giao hàng thất bại",
  CANCELLED: "Đã hủy",
};

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_TRANSIT: "bg-blue-100 text-blue-800",
  DELIVERED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

export default async function DeliveryDetailPage({
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={routePath.admin.delivery.list}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Chi tiết giao hàng
              </h1>
              <p className="text-muted-foreground">
                Mã giao hàng: {delivery.deliveryCode}
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href={routePath.admin.delivery.edit(delivery.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Thông tin giao hàng */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin giao hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Mã giao hàng
                </Label>
                <p className="font-medium">{delivery.deliveryCode}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Mã đơn hàng
                </Label>
                <p className="font-medium">{delivery.orderId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Ngày giao hàng
                </Label>
                <p>
                  {formatDate(new Date(delivery.deliveryDate), "dd/MM/yyyy")}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Thời gian
                </Label>
                <p>
                  {periodLabels[
                    delivery.deliveryPeriod as keyof typeof periodLabels
                  ] || delivery.deliveryPeriod}
                </p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Phí giao hàng
              </Label>
              <p className="font-medium">
                {delivery.deliveryFee.toLocaleString("vi-VN")}đ
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Trạng thái
              </Label>
              <Badge
                className={
                  statusColors[delivery.status as keyof typeof statusColors]
                }
              >
                {statusLabels[delivery.status as keyof typeof statusLabels]}
              </Badge>
            </div>
            {delivery.note && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Ghi chú
                </Label>
                <p className="text-sm">{delivery.note}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Thông tin người nhận */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin người nhận</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Họ và tên
              </Label>
              <p className="font-medium">{delivery.recipientFullname}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Số điện thoại
              </Label>
              <p>{delivery.recipientPhoneNumber}</p>
            </div>
            {delivery.recipientEmail && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Email
                </Label>
                <p>{delivery.recipientEmail}</p>
              </div>
            )}
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Địa chỉ
              </Label>
              <div className="text-sm space-y-1">
                <p>{delivery.recipientAddress.address}</p>
                <p>
                  {delivery.recipientAddress.ward},{" "}
                  {delivery.recipientAddress.district}
                </p>
                <p>{delivery.recipientAddress.province}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
