import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { routePath } from "@/constants/routes";
import { Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

// Mock data - replace with actual data from your API
const newsData = [
  {
    id: 1,
    title: "9 'siêu thực phẩm' cần có trong chế độ ăn uống của người cao tuổi",
    category: "Dinh dưỡng",
    date: "24/05/2024",
    status: "Đã đăng",
  },
  {
    id: 2,
    title:
      "Gợi ý cách thực hiện chế độ ăn tập gym giảm cân cho người mới bắt đầu",
    category: "Sức khỏe",
    date: "04/05/2024",
    status: "Đã đăng",
  },
  // Add more mock data as needed
];

export default function NewsListPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý bài viết</h2>
        <Button asChild>
          <Link href={routePath.admin.news.create}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo bài viết mới
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài viết</CardTitle>
          <CardDescription>
            Quản lý và chỉnh sửa các bài viết của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Ngày đăng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newsData.map((news) => (
                <TableRow key={news.id}>
                  <TableCell className="font-medium">{news.title}</TableCell>
                  <TableCell>{news.category}</TableCell>
                  <TableCell>{news.date}</TableCell>
                  <TableCell>{news.status}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link
                          href={routePath.admin.news.edit(news.id.toString())}
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
