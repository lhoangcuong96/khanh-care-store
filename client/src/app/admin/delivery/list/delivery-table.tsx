"use client";

import {
  AlertCircle,
  CheckCircle2,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Clock,
  MoreHorizontal,
  Search,
  Truck,
  XCircle,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeliveryInListType } from "@/validation-schema/admin/delivery";
import { formatDate } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { routePath } from "@/constants/routes";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import AdminDeliveryRequestApis from "@/api-request/admin/delivery";

enum DeliveryStatus {
  PENDING = "PENDING",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

const deliveryStatuses = [
  {
    value: DeliveryStatus.PENDING,
    label: (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-yellow-500" />
        <span>Chờ giao hàng</span>
      </div>
    ),
  },
  {
    value: DeliveryStatus.IN_TRANSIT,
    label: (
      <div className="flex items-center gap-2">
        <Truck className="h-4 w-4 text-blue-500" />
        <span>Đang giao hàng</span>
      </div>
    ),
  },
  {
    value: DeliveryStatus.DELIVERED,
    label: (
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <span>Đã giao hàng</span>
      </div>
    ),
  },
  {
    value: DeliveryStatus.FAILED,
    label: (
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <span>Giao hàng thất bại</span>
      </div>
    ),
  },
  {
    value: DeliveryStatus.CANCELLED,
    label: (
      <div className="flex items-center gap-2">
        <XCircle className="h-4 w-4 text-gray-500" />
        <span>Đã hủy</span>
      </div>
    ),
  },
];

const periodLabels = {
  morning: "Sáng",
  afternoon: "Chiều",
  evening: "Tối",
};

interface DeliveryTableProps {
  deliveries: DeliveryInListType[];
  errorMessage: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  searchTerm: string;
  statusFilter: string;
  deliveryDateFilter: string;
}

export default function DeliveryTable({
  deliveries,
  errorMessage,
  total,
  page,
  limit,
  totalPages,
  searchTerm,
  statusFilter,
  deliveryDateFilter,
}: DeliveryTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const createQueryString = (params: Record<string, string | number>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value.toString());
      } else {
        newSearchParams.delete(key);
      }
    });
    return newSearchParams.toString();
  };

  const handleSearch = (value: string) => {
    router.push(`?${createQueryString({ search: value, page: 1 })}`);
  };

  const handleStatusFilter = (value: string) => {
    router.push(`?${createQueryString({ status: value, page: 1 })}`);
  };

  const handleDeliveryDateFilter = (value: string) => {
    router.push(`?${createQueryString({ deliveryDate: value, page: 1 })}`);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`?${createQueryString({ page: newPage })}`);
  };

  const handleDeleteDelivery = async (id: string) => {
    try {
      await AdminDeliveryRequestApis.delete(id);
      toast({
        title: "Thành công",
        description: "Đã xóa giao hàng thành công",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          (error as Error).message || "Có lỗi xảy ra khi xóa giao hàng",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await AdminDeliveryRequestApis.updateStatus(id, status);
      toast({
        title: "Thành công",
        description: "Đã cập nhật trạng thái giao hàng thành công",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          (error as Error).message || "Có lỗi xảy ra khi cập nhật trạng thái",
        variant: "destructive",
      });
    }
  };

  if (errorMessage) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">{errorMessage}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Quản lý giao hàng</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href={routePath.admin.delivery.add}>Tạo giao hàng mới</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách giao hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo mã giao hàng, tên khách hàng..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả trạng thái</SelectItem>
                  {deliveryStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={deliveryDateFilter}
                onChange={(e) => handleDeliveryDateFilter(e.target.value)}
                className="w-full sm:w-[200px]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã giao hàng</TableHead>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Ngày giao</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Phí giao hàng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Không có dữ liệu giao hàng
                    </TableCell>
                  </TableRow>
                ) : (
                  deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">
                        {delivery.deliveryCode}
                      </TableCell>
                      <TableCell>{delivery.orderCode}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {delivery.recipientFullname}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {delivery.recipientPhoneNumber}
                          </div>
                          {delivery.recipientEmail && (
                            <div className="text-sm text-muted-foreground">
                              {delivery.recipientEmail}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{delivery.recipientAddress.address}</div>
                          <div className="text-muted-foreground">
                            {delivery.recipientAddress.ward},{" "}
                            {delivery.recipientAddress.district}
                          </div>
                          <div className="text-muted-foreground">
                            {delivery.recipientAddress.province}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(
                          new Date(delivery.deliveryDate),
                          "dd/MM/yyyy"
                        )}
                      </TableCell>
                      <TableCell>
                        {periodLabels[
                          delivery.deliveryPeriod as keyof typeof periodLabels
                        ] || delivery.deliveryPeriod}
                      </TableCell>
                      <TableCell>
                        {delivery.deliveryFee.toLocaleString("vi-VN")}đ
                      </TableCell>
                      <TableCell>
                        {deliveryStatuses.find(
                          (status) => status.value === delivery.status
                        )?.label || delivery.status}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link
                                href={routePath.admin.delivery.detail(
                                  delivery.id
                                )}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={routePath.admin.delivery.edit(
                                  delivery.id
                                )}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>
                              Cập nhật trạng thái
                            </DropdownMenuLabel>
                            {delivery.status !== DeliveryStatus.DELIVERED && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(
                                    delivery.id,
                                    DeliveryStatus.IN_TRANSIT
                                  )
                                }
                              >
                                <Truck className="mr-2 h-4 w-4" />
                                Đang giao hàng
                              </DropdownMenuItem>
                            )}
                            {delivery.status !== DeliveryStatus.DELIVERED && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(
                                    delivery.id,
                                    DeliveryStatus.DELIVERED
                                  )
                                }
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Đã giao hàng
                              </DropdownMenuItem>
                            )}
                            {delivery.status !== DeliveryStatus.FAILED && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(
                                    delivery.id,
                                    DeliveryStatus.FAILED
                                  )
                                }
                              >
                                <AlertCircle className="mr-2 h-4 w-4" />
                                Giao hàng thất bại
                              </DropdownMenuItem>
                            )}
                            {delivery.status !== DeliveryStatus.CANCELLED && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(
                                    delivery.id,
                                    DeliveryStatus.CANCELLED
                                  )
                                }
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Hủy giao hàng
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa giao hàng
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Xác nhận xóa
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa giao hàng này?
                                    Hành động này không thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteDelivery(delivery.id)
                                    }
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Hiển thị {(page - 1) * limit + 1} đến{" "}
                {Math.min(page * limit, total)} trong tổng số {total} giao hàng
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={page === 1}
                >
                  <ChevronFirst className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm">
                  Trang {page} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={page === totalPages}
                >
                  <ChevronLast className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
