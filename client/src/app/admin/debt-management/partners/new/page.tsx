"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreatePartnerType } from "@/validation-schema/admin/debt-management";
import AdminDebtManagementRequestApis from "@/api-request/admin/debt-management";
import { useHandleMessage } from "@/hooks/use-handle-message";
import { PartnerType } from "@/constants/debt";

// Định nghĩa schema validation với Zod
const partnerFormSchema = z.object({
  name: z.string().min(1, { message: "Tên đối tác không được để trống" }),
  phone: z
    .string()
    .min(1, { message: "Số điện thoại không được để trống" })
    .regex(/^[0-9]{10}$/, {
      message: "Số điện thoại không hợp lệ (10 số)",
    }),
  email: z
    .string()
    .email({ message: "Email không hợp lệ" })
    .optional()
    .or(z.literal("")),
  address: z.string().min(1, { message: "Địa chỉ không được để trống" }),
  type: z.string({ required_error: "Vui lòng chọn loại đối tác" }),
  taxCode: z.string().optional(),
  contactPerson: z.string().optional(),
  contactPosition: z.string().optional(),
  contactPhone: z
    .string()
    .regex(/^[0-9]{10,11}$/, {
      message: "Số điện thoại không hợp lệ (10-11 số)",
    })
    .optional()
    .or(z.literal("")),
  notes: z.string().optional(),
});

export default function NewCustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { messageApi } = useHandleMessage();

  // Khởi tạo form với React Hook Form và Zod resolver
  const form = useForm<CreatePartnerType>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      type: PartnerType.INDIVIDUAL,
      contactPerson: "",
      contactPosition: "",
      contactPhone: "",
      notes: "",
    },
  });

  // Xử lý submit form
  const onSubmit = async (data: CreatePartnerType) => {
    setLoading(true);

    try {
      await AdminDebtManagementRequestApis.createPartner(data);
    } catch (error) {
      console.error("Error creating partner:", error);
      messageApi.error({
        title: "Có lỗi xảy ra khi tạo đối tác mới",
        error: "Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  const partnerTypeOptions = [
    {
      value: PartnerType.INDIVIDUAL,
      label: "Cá nhân",
    },
    {
      value: PartnerType.BUSINESS,
      label: "Doanh nghiệp",
    },
    {
      value: PartnerType.DISTRIBUTOR,
      label: "Nhà phân phối",
    },
    {
      value: PartnerType.SUPPLIER,
      label: "Nhà cung cấp",
    },
  ];

  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Thêm đối tác mới</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đối tác</CardTitle>
              <CardDescription>
                Nhập thông tin chi tiết về đối tác mới
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-blue-50 text-blue-700 border-blue-200">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  Các trường có dấu (*) là bắt buộc phải nhập
                </AlertDescription>
              </Alert>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tên đối tác <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên đối tác" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Số điện thoại <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập địa chỉ email"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Địa chỉ <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập địa chỉ đối tác" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Loại đối tác <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại đối tác" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {partnerTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="taxCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã số thuế</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập mã số thuế (nếu có)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">
                  Thông tin người liên hệ
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên người liên hệ</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tên người liên hệ"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPosition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chức vụ</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập chức vụ"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại liên hệ</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập số điện thoại liên hệ"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập ghi chú về đối tác"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => router.back()}
                type="button"
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Đang xử lý..." : "Lưu đối tác"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
