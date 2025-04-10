import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { routePath } from "@/constants/routes";
import PartnersTable from "./partners-table";

export default function CustomersPage() {
  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Quản lý đối tác</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href={routePath.admin.debtManagement.addPartner}>
              Thêm đối tác
            </Link>
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Danh sách đối tác</CardTitle>
            <CardDescription>
              Quản lý thông tin và công nợ của đối tác
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PartnersTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
