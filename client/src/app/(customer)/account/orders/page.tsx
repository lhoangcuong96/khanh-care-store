import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import { Suspense } from "react";
import OrdersTable from "./orders-table";
import { Loader2 } from "lucide-react";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Trang khách hàng | KCS",
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
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          }
        >
          <OrdersTable></OrdersTable>
        </Suspense>
      </CardContent>
    </Card>
  );
}
