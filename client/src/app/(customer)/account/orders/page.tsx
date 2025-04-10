import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import { Suspense } from "react";
import OrdersTable from "./orders-table";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Trang khách hàng | Dollar Organic",
    description: "Trang khách hàng",
  };
};

export default async function Profile() {
  return (
    <Card className="w-full mx-auto lg:py-2 lg:px-8 h-fit rounded-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đơn hàng của bạn</CardTitle>
        <p className="text-sm text-muted-foreground">
          Quản lý thông tin đơn hàng
        </p>
      </CardHeader>
      <CardContent>
        <Suspense fallback="...Loading">
          <OrdersTable></OrdersTable>
        </Suspense>
      </CardContent>
    </Card>
  );
}
