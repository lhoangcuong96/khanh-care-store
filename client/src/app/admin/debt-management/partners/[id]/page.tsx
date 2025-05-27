import Link from "next/link";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerDebtChart } from "./customer-debt-chart";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Giả lập dữ liệu khách hàng
const getCustomerById = (id: string) => {
  const customers = {
    "nguyen-van-hung": {
      id: "nguyen-van-hung",
      name: "Nguyễn Văn Hùng",
      phone: "0912345678",
      email: "hung@example.com",
      address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
      totalDebt: 5200000,
      paidAmount: 3500000,
      remainingDebt: 1700000,
      status: "active",
      joinDate: "15/01/2022",
    },
    "tran-thi-lan": {
      id: "tran-thi-lan",
      name: "Trần Thị Lan",
      phone: "0987654321",
      email: "lan@example.com",
      address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
      totalDebt: 2500000,
      paidAmount: 0,
      remainingDebt: 2500000,
      status: "active",
      joinDate: "20/03/2022",
    },
    "pham-van-duc": {
      id: "pham-van-duc",
      name: "Phạm Văn Đức",
      phone: "0909123456",
      email: "duc@example.com",
      address: "789 Đường Trần Hưng Đạo, Quận 5, TP.HCM",
      totalDebt: 3800000,
      paidAmount: 1000000,
      remainingDebt: 2800000,
      status: "active",
      joinDate: "05/05/2022",
    },
  };

  return customers[id as keyof typeof customers] || null;
};

// Giả lập dữ liệu giao dịch của khách hàng
const getCustomerTransactions = (id: string) => {
  const transactions = {
    "nguyen-van-hung": [
      {
        id: "TX-1001",
        date: "23/03/2023",
        type: "Bán hàng",
        amount: 2200000,
        status: "Đã thanh toán",
        statusColor: "green",
        products: "Thịt ba chỉ (10kg)",
        notes: "Giao hàng tận nơi",
      },
      {
        id: "TX-1008",
        date: "15/04/2023",
        type: "Bán hàng",
        amount: 3000000,
        status: "Chưa thanh toán",
        statusColor: "yellow",
        products: "Thịt nạc vai (15kg)",
        notes: "Khách lấy tại cửa hàng",
      },
      {
        id: "TX-1015",
        date: "20/04/2023",
        type: "Thanh toán",
        amount: -1300000,
        status: "Hoàn thành",
        statusColor: "green",
        products: "",
        notes: "Thanh toán một phần",
      },
      {
        id: "TX-1022",
        date: "05/05/2023",
        type: "Bán hàng",
        amount: 1800000,
        status: "Chưa thanh toán",
        statusColor: "yellow",
        products: "Thịt chân giò (8kg)",
        notes: "",
      },
      {
        id: "TX-1030",
        date: "12/05/2023",
        type: "Thanh toán",
        amount: -2200000,
        status: "Hoàn thành",
        statusColor: "green",
        products: "",
        notes: "Thanh toán đầy đủ cho TX-1001",
      },
    ],
    "tran-thi-lan": [
      {
        id: "TX-1002",
        date: "24/03/2023",
        type: "Bán hàng",
        amount: 2500000,
        status: "Chưa thanh toán",
        statusColor: "yellow",
        products: "Thịt nạc đùi (12kg)",
        notes: "Giao hàng tận nơi",
      },
    ],
    "pham-van-duc": [
      {
        id: "TX-1003",
        date: "25/03/2023",
        type: "Bán hàng",
        amount: 3800000,
        status: "Quá hạn",
        statusColor: "red",
        products: "Thịt ba chỉ (8kg), Thịt nạc vai (10kg)",
        notes: "",
      },
      {
        id: "TX-1018",
        date: "28/04/2023",
        type: "Thanh toán",
        amount: -1000000,
        status: "Hoàn thành",
        statusColor: "green",
        products: "",
        notes: "Thanh toán một phần",
      },
    ],
  };

  return transactions[id as keyof typeof transactions] || [];
};

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = getCustomerById(id);
  const transactions = getCustomerTransactions(id);

  if (!customer) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Không tìm thấy đối tác</h1>
        <Button asChild className="mt-4">
          <Link href="/customers">Quay lại danh sách đối tác</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/customers">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Quay lại</span>
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">{customer.name}</h2>
          <Badge
            variant={customer.remainingDebt > 0 ? "destructive" : "secondary"}
          >
            {customer.remainingDebt > 0 ? "Còn nợ" : "Đã thanh toán"}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            In báo cáo
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
          <Button asChild>
            <Link href={`/transactions/payment?customer=${id}`}>
              Thanh toán công nợ
            </Link>
          </Button>
          <Button>Thêm giao dịch</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng công nợ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customer.totalDebt.toLocaleString()} ₫
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customer.paidAmount.toLocaleString()} ₫
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Còn nợ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customer.remainingDebt.toLocaleString()} ₫
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ngày tham gia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">{customer.joinDate}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Thông tin đối tác</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Họ tên</p>
                  <p className="font-medium">{customer.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Địa chỉ</p>
                <p className="font-medium">{customer.address}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Chỉnh sửa thông tin
            </Button>
          </CardFooter>
        </Card>
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Biểu đồ công nợ</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <CustomerDebtChart customerId={id} />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">Tất cả giao dịch</TabsTrigger>
            <TabsTrigger value="unpaid">Chưa thanh toán</TabsTrigger>
            <TabsTrigger value="paid">Đã thanh toán</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử giao dịch</CardTitle>
              <CardDescription>
                Danh sách tất cả các giao dịch của đối tác
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã giao dịch</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead className="text-right">Số tiền</TableHead>
                    <TableHead>Ghi chú</TableHead>
                    <TableHead className="text-right">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.id}
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.products}</TableCell>
                      <TableCell
                        className={`text-right ${
                          transaction.amount < 0 ? "text-green-600" : ""
                        }`}
                      >
                        {transaction.amount.toLocaleString()} ₫
                      </TableCell>
                      <TableCell>{transaction.notes}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            transaction.statusColor === "red"
                              ? "destructive"
                              : transaction.statusColor === "yellow"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="unpaid" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Giao dịch chưa thanh toán</CardTitle>
              <CardDescription>
                Danh sách các giao dịch chưa thanh toán của đối tác
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã giao dịch</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead className="text-right">Số tiền</TableHead>
                    <TableHead>Ghi chú</TableHead>
                    <TableHead className="text-right">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions
                    .filter(
                      (t) =>
                        t.status === "Chưa thanh toán" || t.status === "Quá hạn"
                    )
                    .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.id}
                        </TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>{transaction.products}</TableCell>
                        <TableCell className="text-right">
                          {transaction.amount.toLocaleString()} ₫
                        </TableCell>
                        <TableCell>{transaction.notes}</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              transaction.statusColor === "red"
                                ? "destructive"
                                : transaction.statusColor === "yellow"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="paid" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Giao dịch đã thanh toán</CardTitle>
              <CardDescription>
                Danh sách các giao dịch đã thanh toán của đối tác
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã giao dịch</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead className="text-right">Số tiền</TableHead>
                    <TableHead>Ghi chú</TableHead>
                    <TableHead className="text-right">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions
                    .filter(
                      (t) =>
                        t.status === "Đã thanh toán" ||
                        t.status === "Hoàn thành"
                    )
                    .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.id}
                        </TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>{transaction.products}</TableCell>
                        <TableCell
                          className={`text-right ${
                            transaction.amount < 0 ? "text-green-600" : ""
                          }`}
                        >
                          {transaction.amount.toLocaleString()} ₫
                        </TableCell>
                        <TableCell>{transaction.notes}</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              transaction.statusColor === "red"
                                ? "destructive"
                                : transaction.statusColor === "yellow"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
