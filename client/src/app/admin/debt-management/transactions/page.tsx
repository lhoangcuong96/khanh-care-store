import Link from "next/link";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { routePath } from "@/constants/routes";

export default function TransactionsPage() {
  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Giao dịch</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href={routePath.admin.debtManagement.transactionAdd}>
              Thêm giao dịch mới
            </Link>
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử giao dịch</CardTitle>
            <CardDescription>
              Quản lý các giao dịch mua bán và thanh toán
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã giao dịch</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Đối tác</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead className="text-right">Số tiền</TableHead>
                  <TableHead className="text-right">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">TX-1001</TableCell>
                  <TableCell>23/03/2023</TableCell>
                  <TableCell>Nguyễn Văn Hùng</TableCell>
                  <TableCell>Bán hàng</TableCell>
                  <TableCell className="text-right">5.200.000 ₫</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Đã thanh toán
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">TX-1002</TableCell>
                  <TableCell>24/03/2023</TableCell>
                  <TableCell>Trần Thị Lan</TableCell>
                  <TableCell>Bán hàng</TableCell>
                  <TableCell className="text-right">2.500.000 ₫</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      Chưa thanh toán
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">TX-1003</TableCell>
                  <TableCell>25/03/2023</TableCell>
                  <TableCell>Phạm Văn Đức</TableCell>
                  <TableCell>Bán hàng</TableCell>
                  <TableCell className="text-right">3.800.000 ₫</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      Quá hạn
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">TX-1004</TableCell>
                  <TableCell>26/03/2023</TableCell>
                  <TableCell>Lê Thị Hoa</TableCell>
                  <TableCell>Thanh toán</TableCell>
                  <TableCell className="text-right">1.500.000 ₫</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Hoàn thành
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">TX-1005</TableCell>
                  <TableCell>27/03/2023</TableCell>
                  <TableCell>Đỗ Minh Tuấn</TableCell>
                  <TableCell>Bán hàng</TableCell>
                  <TableCell className="text-right">4.000.000 ₫</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      Chưa thanh toán
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
