"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Search, ShoppingCart, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Mock data - replace with actual API calls
const mockProducts = [
  { id: 1, name: "Sản phẩm A", price: "100.000đ", stock: 50 },
  { id: 2, name: "Sản phẩm B", price: "200.000đ", stock: 30 },
];

const mockOrders = [
  { id: 1, customer: "Nguyễn Văn A", total: "500.000đ", status: "Đã giao" },
  { id: 2, customer: "Trần Thị B", total: "300.000đ", status: "Đang xử lý" },
];

const mockCustomers = [
  { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com", orders: 5 },
  { id: 2, name: "Trần Thị B", email: "tranthib@example.com", orders: 3 },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="flex-1 space-y-4 p-2 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Kết quả tìm kiếm</h2>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Tìm kiếm..."
            className="w-[300px]"
            defaultValue={query}
          />
          <Button>
            <Search className="mr-2 h-4 w-4" />
            Tìm kiếm
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
          <TabsTrigger value="customers">Khách hàng</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                Sản phẩm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Giá: {product.price}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tồn kho: {product.stock}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">Đơn hàng #{order.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        Khách hàng: {order.customer}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.total} - {order.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{customer.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {customer.email}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {customer.orders} đơn hàng
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Giá: {product.price}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tồn kho: {product.stock}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">Đơn hàng #{order.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        Khách hàng: {order.customer}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.total} - {order.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{customer.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {customer.email}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {customer.orders} đơn hàng
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
