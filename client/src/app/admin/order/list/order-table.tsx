"use client";

import {
  AlertCircle,
  ArrowLeftRight,
  CheckCircle2,
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Filter,
  MoreHorizontal,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

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
import { OrderInListDataType } from "@/validation-schema/admin/order";
import { formatDate } from "date-fns";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { adminOrderRequestApi } from "@/api-request/admin/order";
import { useToast } from "@/hooks/use-toast";

enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  RETURNED = "RETURNED",
}

const finalOrderStatusOptions = [
  {
    value: OrderStatus.CANCELLED,
    label: (
      <div className="flex items-center gap-2">
        <XCircle className="h-4 w-4 text-red-500" />
        <span>Đã hủy</span>
      </div>
    ),
  },
  {
    value: OrderStatus.COMPLETED,
    label: (
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <span>Đã hoàn thành</span>
      </div>
    ),
  },
  {
    value: OrderStatus.RETURNED,
    label: (
      <div className="flex items-center gap-2">
        <ArrowLeftRight className="h-4 w-4 text-gray-500" />
        <span>Đã hoàn tiền</span>
      </div>
    ),
  },
  {
    value: OrderStatus.REFUNDED,
    label: (
      <div className="flex items-center gap-2">
        <ArrowLeftRight className="h-4 w-4 text-gray-500" />
        <span>Đã trả lại</span>
      </div>
    ),
  },
];

const activeOrderStatusOptions: {
  value: OrderStatus;
  label: React.ReactNode;
}[] = [
  {
    value: OrderStatus.PENDING,
    label: (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-yellow-500" />
        <span>Chờ xác nhận</span>
      </div>
    ),
  },
  {
    value: OrderStatus.PROCESSING,
    label: (
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 text-blue-500" />
        <span>Đang xử lý</span>
      </div>
    ),
  },
  {
    value: OrderStatus.SHIPPED,
    label: (
      <div className="flex items-center gap-2">
        <Truck className="h-4 w-4 text-blue-500" />
        <span>Đang vận chuyển</span>
      </div>
    ),
  },
  {
    value: OrderStatus.DELIVERED,
    label: (
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <span>Đã giao</span>
      </div>
    ),
  },
  {
    value: OrderStatus.FAILED,
    label: (
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <span>Đã thất bại</span>
      </div>
    ),
  },
];

export default function AdminOrdersTable({
  searchTerm,
  statusFilter,
  initialOrders,
  errorMessage,
  total,
  page,
  limit,
  totalPages,
}: {
  searchTerm: string;
  statusFilter: string;
  initialOrders: OrderInListDataType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  errorMessage?: string;
}) {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchTerm);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [disabledChangeStatus, setDisabledChangeStatus] = useState<
    Record<string, boolean>
  >({});

  const [orders, setOrders] = useState<OrderInListDataType[]>([]);

  const router = useRouter();
  const { toast } = useToast();

  // Toggle expanded row
  const toggleRowExpanded = (orderId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // // Filter orders based on search term and status filter
  // const filteredOrders = orders.filter((order) => {
  //   const matchesSearch =
  //     order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     order.email.toLowerCase().includes(searchTerm.toLowerCase());

  //   const matchesStatus =
  //     statusFilter === "all" || order.status === statusFilter;

  //   return matchesSearch && matchesStatus;
  // });

  // Calculate pagination
  // const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  // const totalPages = 1;
  const indexOfLastItem = Number(page) * Number(limit);
  const indexOfFirstItem = indexOfLastItem - Number(limit);
  // const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page changes
  const goToPage = (pageNumber: number) => {
    // setCurrentPage(pageNumber);
    // Close any expanded rows when changing pages
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    router.push(`?${params.toString()}`);
    setExpandedRows({});
  };

  const goToFirstPage = () => goToPage(1);
  const goToPreviousPage = () => goToPage(Math.max(1, Number(page) - 1));
  const goToNextPage = () => goToPage(Math.min(totalPages, Number(page) + 1));
  const goToLastPage = () => goToPage(totalPages);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of page range
      let startPage = Math.max(2, Number(page) - 1);
      let endPage = Math.min(totalPages - 1, Number(page) + 1);

      // Adjust if we're near the beginning
      if (Number(page) <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }

      // Adjust if we're near the end
      if (Number(page) >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis-end");
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.set("search", search);
    router.push(`?${params.toString()}`);
  };
  const handleChangeStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setDisabledChangeStatus((prev) => ({
        ...prev,
        [orderId]: true,
      }));
      await adminOrderRequestApi.changeStatus({ orderId }, { status });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      toast({
        title: "Cập nhật trạng thái đơn hàng thành công",
        variant: "success",
        duration: 1000,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Cập nhật trạng thái đơn hàng thất bại",
        variant: "destructive",
        duration: 1000,
      });
    } finally {
      setDisabledChangeStatus((prev) => ({
        ...prev,
        [orderId]: false,
      }));
    }
  };

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {errorMessage && (
            <div className="text-red-500 text-sm">{errorMessage}</div>
          )}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex w-full sm:w-auto items-center gap-2">
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
                  className="pl-8 w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="ml-2 bg-slate-700 text-white hover:bg-slate-800 hover:text-white h-8 w-8 p-0 absolute right-0 top-1/2 -translate-y-1/2"
                  onClick={() => {
                    handleSearch();
                  }}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="w-full sm:w-[200px]">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    const params = new URLSearchParams(searchParams);
                    params.set("status", value === "all" ? "" : value);
                    params.set("page", "1");
                    router.push(`?${params.toString()}`);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    {[
                      ...activeOrderStatusOptions,
                      ...finalOrderStatusOptions,
                    ].map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Thêm bộ lọc
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất Excel
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[100px]">Mã đơn hàng</TableHead>
                  <TableHead>Thông tin khách hàng</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Ngày tạo đơn
                  </TableHead>
                  <TableHead>Trạng thái</TableHead>
                  {/* <TableHead className="hidden lg:table-cell">
                    Thanh toán
                  </TableHead> */}
                  <TableHead className="hidden md:table-cell">
                    Số lượng sản phẩm
                  </TableHead>
                  <TableHead className="text-right">
                    Tổng tiền đơn hàng
                  </TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Không tìm thấy đơn hàng
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => {
                    const disabledActiveStatus = finalOrderStatusOptions.some(
                      (status) => status.value === order.status
                    );

                    return (
                      <>
                        <TableRow
                          key={order.id}
                          className={expandedRows[order.id] ? "border-b-0" : ""}
                        >
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0"
                              onClick={() => toggleRowExpanded(order.id)}
                            >
                              {expandedRows[order.id] ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="font-medium">
                            {order.orderCode}
                          </TableCell>
                          <TableCell>
                            <div>
                              {order.deliveryInformation.recipientFullname}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {order.deliveryInformation.recipientPhoneNumber}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatDate(order.createdAt, "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value) => {
                                handleChangeStatus(
                                  order.id,
                                  value as OrderStatus
                                );
                              }}
                              disabled={disabledChangeStatus[order.id]}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">
                                  Tất cả trạng thái
                                </SelectItem>
                                {activeOrderStatusOptions.map((status) => (
                                  <SelectItem
                                    key={status.value}
                                    value={status.value}
                                    disabled={disabledActiveStatus}
                                  >
                                    {status.label}
                                  </SelectItem>
                                ))}
                                {finalOrderStatusOptions.map((status) => (
                                  <SelectItem
                                    key={status.value}
                                    value={status.value}
                                  >
                                    {status.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          {/* <TableCell className="hidden lg:table-cell">
                              {order.payment}
                            </TableCell> */}
                          <TableCell className="hidden md:table-cell">
                            {order.items.length}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="text-sm text-muted-foreground">
                              Phí vận chuyển:{" "}
                              {order.deliveryInformation.shippingFee.toLocaleString()}
                              đ
                            </div>
                            <div className="font-medium">
                              {order.totalAmount.toLocaleString()}đ
                            </div>
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
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  View details
                                </DropdownMenuItem>
                                <DropdownMenuItem>Edit order</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  Update status
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Contact customer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  Print invoice
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  Cancel order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        {expandedRows[order.id] && (
                          <TableRow className="bg-muted/50">
                            <TableCell colSpan={9} className="p-0">
                              <div className="px-4 py-3">
                                {/* Shipping Information */}
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Truck className="h-4 w-4" />
                                    <h4 className="font-medium">
                                      Thông tin giao hàng
                                    </h4>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-1">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Người nhận:
                                        </span>
                                        <span className="font-medium">
                                          {
                                            order.deliveryInformation
                                              .recipientFullname
                                          }
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Số điện thoại:
                                        </span>
                                        <span>
                                          {
                                            order.deliveryInformation
                                              .recipientPhoneNumber
                                          }
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Phí vận chuyển:
                                        </span>
                                        <span>
                                          {order.deliveryInformation.shippingFee.toLocaleString()}
                                          đ
                                        </span>
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Địa chỉ:
                                        </span>
                                        <span className="text-right max-w-[200px]">
                                          {
                                            order.deliveryInformation
                                              .recipientAddress.address
                                          }
                                          ,{" "}
                                          {
                                            order.deliveryInformation
                                              .recipientAddress.ward
                                          }
                                          ,{" "}
                                          {
                                            order.deliveryInformation
                                              .recipientAddress.district
                                          }
                                          ,{" "}
                                          {
                                            order.deliveryInformation
                                              .recipientAddress.province
                                          }
                                        </span>
                                      </div>
                                      {order.deliveryInformation
                                        .shippingDate && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">
                                            Ngày giao hàng:
                                          </span>
                                          <span>
                                            {formatDate(
                                              new Date(
                                                order.deliveryInformation.shippingDate
                                              ),
                                              "dd/MM/yyyy"
                                            )}
                                          </span>
                                        </div>
                                      )}
                                      {order.deliveryInformation
                                        .shippingPeriod && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">
                                            Thời gian giao:
                                          </span>
                                          <span>
                                            {order.deliveryInformation
                                              .shippingPeriod === "morning"
                                              ? "Sáng (8h-12h)"
                                              : order.deliveryInformation
                                                  .shippingPeriod ===
                                                "afternoon"
                                              ? "Chiều (13h-17h)"
                                              : order.deliveryInformation
                                                  .shippingPeriod === "evening"
                                              ? "Tối (18h-22h)"
                                              : order.deliveryInformation
                                                  .shippingPeriod}
                                          </span>
                                        </div>
                                      )}
                                      {order.deliveryInformation.note && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">
                                            Ghi chú:
                                          </span>
                                          <span className="text-right max-w-[200px] italic">
                                            {order.deliveryInformation.note}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                  <ShoppingBag className="h-4 w-4" />
                                  <h4 className="font-medium">
                                    Sản phẩm trong đơn hàng
                                  </h4>
                                </div>
                                <div className="rounded-md border bg-background">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Sản phẩm</TableHead>
                                        <TableHead className="text-right">
                                          Giá
                                        </TableHead>
                                        <TableHead className="text-right">
                                          Số lượng
                                        </TableHead>
                                        <TableHead className="text-right">
                                          Tổng tiền sản phẩm
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {order.items?.map((item) => (
                                        <TableRow key={item.productId}>
                                          <TableCell className="font-medium flex items-center gap-2">
                                            <Image
                                              src={item.productImage}
                                              alt={item.productName}
                                              width={60}
                                              height={60}
                                              className="rounded-md"
                                            />
                                            <div className="flex flex-col">
                                              {item.productName}
                                              {item.productVariant && (
                                                <span className="text-sm text-muted-foreground">
                                                  {item.productVariant.name}
                                                </span>
                                              )}
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {item.productPrice.toLocaleString()}
                                            đ
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {item.productQuantity}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {(
                                              item.productPrice *
                                              item.productQuantity
                                            ).toLocaleString()}
                                            đ
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                      <TableRow>
                                        <TableCell
                                          colSpan={3}
                                          className="text-right font-medium"
                                        >
                                          Tổng:
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                          {order.totalAmount.toLocaleString()}đ
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Số mục mỗi trang
              </span>
              <Select
                value={limit.toString()}
                onValueChange={(value) => {
                  const params = new URLSearchParams(searchParams);
                  params.set("limit", value);
                  router.push(`?${params.toString()}`);
                }}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                Đang hiển thị {indexOfFirstItem + 1}-{indexOfLastItem} trên{" "}
                {total} đơn hàng
                {/* {Math.min(indexOfLastItem, filteredOrders.length)} trên{" "}
                {filteredOrders.length} đơn hàng */}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToFirstPage}
                disabled={page === 1}
              >
                <ChevronFirst className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToPreviousPage}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>

              {getPageNumbers().map((pageNumber, index) => {
                if (
                  pageNumber === "ellipsis-start" ||
                  pageNumber === "ellipsis-end"
                ) {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 py-1 text-muted-foreground"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={page === pageNumber ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => goToPage(pageNumber as number)}
                  >
                    {pageNumber}
                    <span className="sr-only">Page {pageNumber}</span>
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToNextPage}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToLastPage}
                disabled={page === totalPages}
              >
                <ChevronLast className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
