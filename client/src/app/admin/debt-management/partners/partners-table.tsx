"use client";

import AdminDebtManagementRequestApis from "@/api-request/admin/debt-management";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { partnerTypeOptions } from "@/constants/debt";
import { useHandleMessage } from "@/hooks/use-handle-message";
import { PartnerInListType } from "@/validation-schema/admin/debt-management";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
export default function PartnersTable() {
  const searchParams = useSearchParams();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [partners, setPartners] = useState<PartnerInListType[]>([]);
  const { messageApi } = useHandleMessage();

  const { data } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const resp = await AdminDebtManagementRequestApis.getListPartners({
        page: Number(searchParams.get("page")) || 1,
        limit: Number(searchParams.get("limit")) || 10,
        search: searchParams.get("search") || "",
      });
      return resp;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const handleDeletePartner = async (id: string) => {
    setDeletingId(id);
    setIsDeleting(true);

    try {
      await AdminDebtManagementRequestApis.deletePartner(id);
      messageApi.success({
        description: "Xóa đối tác thành công",
      });
      setPartners((prev) => prev.filter((partner) => partner.id !== id));
    } catch (error) {
      // Hiển thị thông báo lỗi
      console.error(error);
      messageApi.error({
        error: "Xóa đối tác không thành công",
      });
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (data?.payload?.data) {
      setPartners(data.payload.data.partners);
    }
  }, [data]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên đối tác</TableHead>
          <TableHead className="text-center">Loại đối tác</TableHead>
          <TableHead className="text-center">Số điện thoại</TableHead>
          <TableHead className="text-center">Địa chỉ</TableHead>
          <TableHead className="text-center">Công nợ hiện tại</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {partners.map((partner) => (
          <TableRow key={partner.id}>
            <TableCell className="font-medium">{partner.name}</TableCell>
            <TableCell className="text-center">
              {
                partnerTypeOptions.find(
                  (option) => option.value === partner.type
                )?.label
              }
            </TableCell>
            <TableCell className="text-center">{partner.phone}</TableCell>
            <TableCell className="text-center">{partner.address}</TableCell>
            <TableCell className="text-center">
              {partner.remainingDebt.toLocaleString()} ₫
            </TableCell>

            <TableCell className="text-right ">
              <div className="flex flex-col gap-2 items-end">
                <Button variant="outline" size="sm" asChild className="w-fit">
                  <Link href={`/customers/${partner.id}`}>
                    Xem chi tiết công nợ
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="w-fit">
                  <Link href={`/customers/${partner.id}`}>Sửa thông tin</Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 w-fit"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa đối tác</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa đối tác{" "}
                        <span className="font-bold">{partner.name}</span>? Hành
                        động này không thể hoàn tác và sẽ xóa tất cả dữ liệu
                        liên quan đến đối tác này.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeletePartner(partner.id)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                        disabled={isDeleting && deletingId === partner.id}
                      >
                        {isDeleting && deletingId === partner.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xóa...
                          </>
                        ) : (
                          "Xác nhận xóa"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
