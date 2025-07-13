"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Package, Search } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import orderRequestApis from "@/api-request/order";
import { useHandleMessage } from "@/hooks/use-handle-message";
import { GetListOrderDataType } from "@/validation-schema/order";
import { orderStatusEnum } from "@/constants/order";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";
import { routePath } from "@/constants/routes";
import { useSearchParams } from "next/navigation";

export default function OrdersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<GetListOrderDataType[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string[]>([]);

  const { messageApi } = useHandleMessage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || "all";

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder((prev) => {
      if (prev.includes(orderId)) {
        return prev.filter((id) => id !== orderId);
      }
      return [...prev, orderId];
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500";
      case "in transit":
        return "bg-blue-500";
      case "processing":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getOrders = async (searchTerm?: string, status?: string) => {
    try {
      setIsLoading(true);
      const response = await orderRequestApis.getListOrders(searchTerm, status);
      console.log(response);
      if (!response.payload?.data) {
        messageApi.error({
          error: "Có lỗi xảy ra khi tải dữ liệu",
        });
        return;
      }
      setOrders(response.payload.data);
    } catch (error) {
      messageApi.error({
        error: "Có lỗi xảy ra khi tải dữ liệu",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch !== initialSearch) {
      params.set("search", debouncedSearch);
      router.push(`${routePath.customer.account.orders}?${params.toString()}`);
    }
  }, [debouncedSearch, initialSearch]);

  useEffect(() => {
    const statusToSend = initialStatus === "all" ? undefined : initialStatus;
    getOrders(initialSearch, statusToSend);
  }, [initialSearch, initialStatus]);

  return (
    <div className="container min-h-96">
      <div className="mb-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm đơn hàng theo mã"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={initialStatus}
              onValueChange={(value) => {
                const params = new URLSearchParams(searchParams.toString());
                if (value === "all") {
                  params.delete("status");
                } else {
                  params.set("status", value);
                }
                router.push(
                  `${routePath.customer.account.orders}?${params.toString()}`
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {Object.entries(orderStatusEnum).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="text-center py-8">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-lg font-semibold">Đang tải dữ liệu...</p>
        </div>
      )}
      {!isLoading && (!orders || orders.length === 0) && (
        <div className="text-center py-14">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-lg font-semibold">
            Không có đơn hàng nào được tìm thấy
          </p>
        </div>
      )}
      {!isLoading &&
        orders &&
        orders.length > 0 &&
        orders.map((order) => (
          <Card key={order.id} className="mb-5">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Mã đơn hàng: {order.orderCode}</span>
                <Badge className={getStatusColor(order.status)}>
                  {
                    orderStatusEnum[
                      order.status as keyof typeof orderStatusEnum
                    ]
                  }
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span>{format(order.createdAt, "dd/MM/yyyy")}</span>
                <span className="font-semibold">
                  {order.totalAmount.toLocaleString()}đ
                </span>
              </div>
              <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                <span>Phí vận chuyển:</span>
                <span>
                  {order.deliveryInformation?.shippingFee?.toLocaleString() ||
                    0}
                  đ
                </span>
              </div>

              {/* Shipping Information Section */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2 text-gray-700">
                  Thông tin giao hàng
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Người nhận:</span>
                    <span className="font-medium">
                      {order.deliveryInformation?.recipientFullname || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số điện thoại:</span>
                    <span>
                      {order.deliveryInformation?.recipientPhoneNumber || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Địa chỉ:</span>
                    <span className="text-right max-w-[200px]">
                      {order.deliveryInformation?.recipientAddress
                        ? `${order.deliveryInformation.recipientAddress.address}, ${order.deliveryInformation.recipientAddress.ward}, ${order.deliveryInformation.recipientAddress.district}, ${order.deliveryInformation.recipientAddress.province}`
                        : "N/A"}
                    </span>
                  </div>
                  {order.deliveryInformation?.shippingDate && (
                    <div className="flex justify-between">
                      <span>Ngày giao hàng:</span>
                      <span>
                        {format(
                          new Date(order.deliveryInformation.shippingDate),
                          "dd/MM/yyyy"
                        )}
                      </span>
                    </div>
                  )}
                  {order.deliveryInformation?.shippingPeriod && (
                    <div className="flex justify-between">
                      <span>Thời gian giao:</span>
                      <span>
                        {order.deliveryInformation.shippingPeriod === "morning"
                          ? "Sáng (8h-12h)"
                          : order.deliveryInformation.shippingPeriod ===
                            "afternoon"
                          ? "Chiều (13h-17h)"
                          : order.deliveryInformation.shippingPeriod ===
                            "evening"
                          ? "Tối (18h-22h)"
                          : order.deliveryInformation.shippingPeriod}
                      </span>
                    </div>
                  )}
                  {order.deliveryInformation?.note && (
                    <div className="flex justify-between">
                      <span>Ghi chú:</span>
                      <span className="text-right max-w-[200px] italic">
                        {order.deliveryInformation.note}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => toggleOrderDetails(order.id)}
                className="w-full mt-2"
              >
                {expandedOrder.includes(order.id) ? (
                  <>
                    Ẩn chi tiết
                    <ChevronUp className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Xem chi tiết
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              {expandedOrder.includes(order.id) && (
                <Table className="mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="text-right">Số lượng</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex flex-col md:flex-row gap-4 items-center justify-start">
                            <Image
                              src={item.productImage || "/placeholder.svg"}
                              alt={item.productName}
                              width={80}
                              height={60}
                              className="rounded-lg"
                            />
                            <div className="flex flex-col gap-2">
                              <div className="font-medium h-fit">
                                {item.productName}
                              </div>
                              {item.productVariant && (
                                <div className="text-sm text-gray-500">
                                  {item.productVariant.name}
                                </div>
                              )}
                              <div className="text-sm text-gray-500">
                                {item.productPrice.toLocaleString()}đ
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.productQuantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
