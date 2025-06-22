"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { locations } from "@/constants/order";
import { periodOptions } from "@/constants/order";
import { routePath } from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import { CreateDeliveryBodySchema } from "@/validation-schema/admin/delivery";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import AdminDeliveryRequestApis from "@/api-request/admin/delivery";

type FormData = {
  orderId: string;
  deliveryCode: string;
  recipientFullname: string;
  recipientPhoneNumber: string;
  recipientEmail: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  deliveryDate: Date;
  deliveryPeriod: string;
  deliveryFee: number;
  note: string;
};

export default function DeliveryForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(CreateDeliveryBodySchema),
    defaultValues: {
      orderId: "",
      deliveryCode: "",
      recipientFullname: "",
      recipientPhoneNumber: "",
      recipientEmail: "",
      address: "",
      province: locations[0]?.label || "",
      district: locations[0]?.districts[0]?.label || "",
      ward: "",
      deliveryDate: new Date(),
      deliveryPeriod: periodOptions[0]?.value || "",
      deliveryFee: 0,
      note: "",
    },
  });

  const province = watch("province");
  const district = watch("district");

  const listDistrict =
    locations.find((item) => item.label === province)?.districts || [];
  const listWard =
    listDistrict.find((item) => item.label === district)?.wards || [];

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      const deliveryData = {
        orderId: data.orderId,
        deliveryCode: data.deliveryCode,
        recipientFullname: data.recipientFullname,
        recipientPhoneNumber: data.recipientPhoneNumber,
        recipientEmail: data.recipientEmail || null,
        recipientAddress: {
          address: data.address,
          ward: data.ward,
          district: data.district,
          province: data.province,
        },
        deliveryDate: data.deliveryDate,
        deliveryPeriod: data.deliveryPeriod as
          | "morning"
          | "afternoon"
          | "evening",
        deliveryFee: data.deliveryFee,
        note: data.note || null,
        status: "PENDING" as const,
      };

      await AdminDeliveryRequestApis.create(deliveryData);

      toast({
        title: "Thành công",
        description: "Đã tạo giao hàng thành công",
      });

      router.push(routePath.admin.delivery.list);
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          (error as Error).message || "Có lỗi xảy ra khi tạo giao hàng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orderId">
                  Mã đơn hàng <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="orderId"
                  {...register("orderId")}
                  placeholder="Nhập mã đơn hàng"
                />
                {errors.orderId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.orderId.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="deliveryCode">
                  Mã giao hàng <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="deliveryCode"
                  {...register("deliveryCode")}
                  placeholder="Nhập mã giao hàng"
                />
                {errors.deliveryCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.deliveryCode.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin người nhận</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipientFullname">
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="recipientFullname"
                  {...register("recipientFullname")}
                  placeholder="Nhập họ và tên người nhận"
                />
                {errors.recipientFullname && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.recipientFullname.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="recipientPhoneNumber">
                  Số điện thoại <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="recipientPhoneNumber"
                  {...register("recipientPhoneNumber")}
                  placeholder="Nhập số điện thoại"
                />
                {errors.recipientPhoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.recipientPhoneNumber.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="recipientEmail">Email</Label>
              <Input
                id="recipientEmail"
                {...register("recipientEmail")}
                placeholder="Nhập email (không bắt buộc)"
              />
              {errors.recipientEmail && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.recipientEmail.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Địa chỉ giao hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">
                Địa chỉ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                {...register("address")}
                placeholder="Nhập địa chỉ chi tiết"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="province">
                  Tỉnh/Thành phố <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="province"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setValue("district", "");
                        setValue("ward", "");
                      }}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((province) => (
                          <SelectItem
                            key={province.label}
                            value={province.label}
                          >
                            {province.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.province && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.province.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="district">
                  Quận/Huyện <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="district"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setValue("ward", "");
                      }}
                      value={field.value}
                      disabled={!province}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        {listDistrict.map((district) => (
                          <SelectItem
                            key={district.label}
                            value={district.label}
                          >
                            {district.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.district && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.district.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="ward">
                  Phường/Xã <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="ward"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!district}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phường/xã" />
                      </SelectTrigger>
                      <SelectContent>
                        {listWard.map((ward) => (
                          <SelectItem key={ward.label} value={ward.label}>
                            {ward.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.ward && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.ward.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin giao hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="deliveryDate">
                  Ngày giao hàng <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="deliveryDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP", { locale: vi })
                          ) : (
                            <span>Chọn ngày</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.deliveryDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.deliveryDate.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="deliveryPeriod">
                  Thời gian giao hàng <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="deliveryPeriod"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thời gian" />
                      </SelectTrigger>
                      <SelectContent>
                        {periodOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.deliveryPeriod && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.deliveryPeriod.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="deliveryFee">
                  Phí giao hàng <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  {...register("deliveryFee", { valueAsNumber: true })}
                  placeholder="Nhập phí giao hàng"
                />
                {errors.deliveryFee && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.deliveryFee.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea
                id="note"
                {...register("note")}
                placeholder="Nhập ghi chú (không bắt buộc)"
                rows={3}
              />
              {errors.note && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.note.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" asChild>
            <Link href={routePath.admin.delivery.list}>Hủy</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang tạo..." : "Tạo giao hàng"}
          </Button>
        </div>
      </form>
    </div>
  );
}
