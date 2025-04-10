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

export default function OrdersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<GetListOrderDataType[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string[]>([]);

  const { messageApi } = useHandleMessage();

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

  const getOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderRequestApis.getListOrders();
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

  useEffect(() => {
    getOrders();
  }, []);
  return (
    <div className="container min-h-96">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm đơn hàng theo mã"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
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
                  ${order.totalAmount.toLocaleString()}đ
                </span>
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
                          <div className="flex flex-col md:flex-row gap-4 items-start">
                            <Image
                              src={item.productImage || "/placeholder.svg"}
                              alt={item.productName}
                              width={80}
                              height={60}
                              className="rounded-lg"
                            />
                            <div className="font-medium h-fit">
                              {item.productName}
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
