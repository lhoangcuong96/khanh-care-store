"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Search,
  Download,
  RefreshCw,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  ChevronLeft,
  ChevronLast,
  ChevronFirst,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderInListDataType } from "@/validation-schema/admin/order";
import { formatDate } from "date-fns";

export default function AdminOrdersTable({
  orders,
}: {
  orders: OrderInListDataType[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
  const totalPages = 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page changes
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Close any expanded rows when changing pages
    setExpandedRows({});
  };

  const goToFirstPage = () => goToPage(1);
  const goToPreviousPage = () => goToPage(Math.max(1, currentPage - 1));
  const goToNextPage = () => goToPage(Math.min(totalPages, currentPage + 1));
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
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "processing":
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex w-full sm:w-auto items-center gap-2">
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm đơn hàng..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-[200px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="completed">Đã hoàng thành</SelectItem>
                    <SelectItem value="processing">Đang xử lý</SelectItem>
                    <SelectItem value="pending">Đang chờ</SelectItem>
                    <SelectItem value="cancelled">Đã huỷ</SelectItem>
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
                      No orders found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
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
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <Badge
                              className={getStatusColor(order.status)}
                              variant="outline"
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </Badge>
                          </div>
                        </TableCell>
                        {/* <TableCell className="hidden lg:table-cell">
                          {order.payment}
                        </TableCell> */}
                        <TableCell className="hidden md:table-cell">
                          {order.items.length}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {order.totalAmount.toLocaleString()}đ
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
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem>Edit order</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Update status</DropdownMenuItem>
                              <DropdownMenuItem>
                                Contact customer
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Print invoice</DropdownMenuItem>
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
                                        <TableCell className="font-medium">
                                          {item.productName}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          {item.productPrice.toLocaleString()}đ
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
                  ))
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
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1); // Reset to first page when changing items per page
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
                Đang hiển thị {indexOfFirstItem + 1}-
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
                disabled={currentPage === 1}
              >
                <ChevronFirst className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
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
                    variant={currentPage === pageNumber ? "default" : "outline"}
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
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
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
