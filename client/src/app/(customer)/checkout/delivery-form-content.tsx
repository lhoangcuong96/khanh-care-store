"use client";

import { accountApiRequest } from "@/api-request/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locations } from "@/constants/order";
import { useHandleMessage } from "@/hooks/use-handle-message";
import { Controller, useFormContext } from "react-hook-form";

export default function DeliveryFormContent() {
  const { messageApi } = useHandleMessage();
  const {
    register,
    formState: { errors },
    watch,
    control,
    getValues,
    trigger,
  } = useFormContext();

  const province = watch("province");
  const listDistrict =
    locations.find((item) => item.label === province)?.districts || [];
  const district = watch("district");
  const listWard =
    listDistrict.find((item) => item.label === district)?.wards || [];

  const saveShippingAddress = async () => {
    const address = getValues("address");
    const province = getValues("province");
    const district = getValues("district");
    const ward = getValues("ward");
    const isValid = await trigger();

    if (!address || !province || !district || !ward || !isValid) {
      messageApi.error({
        error: "Vui lòng nhập đầy đủ thông tin địa chỉ",
      });
      return;
    }
    const data = {
      address,
      province,
      district,
      ward,
    };
    try {
      await accountApiRequest.updateShippingAddress(data);
      messageApi.success({
        description: "Lưu địa chỉ thành công",
      });
    } catch (error) {
      console.error(error);
      messageApi.error({
        error: "Có lỗi xảy ra khi lưu địa chỉ",
      });
    }
  };
  return (
    <div className="lg:col-span-2 space-y-8">
      {/* Customer Information */}
      <div className="bg-white lg:p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-semibold mb-4">Thông tin nhận hàng</h2>
        <div>
          <Label className="mb-2 block" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            {...register("email")}
            placeholder="Ví dụ: phamvana@gmail.com"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email?.message?.toString()}</p>
          )}
        </div>
        <div>
          <Label className="mb-2 block" htmlFor="fullname">
            Họ và tên
          </Label>
          <Input
            id="fullname"
            {...register("fullname")}
            placeholder="Ví dụ: Phạm Văn A"
          />
          {errors.fullname && (
            <p className="text-red-500">
              {errors.fullname?.message?.toString()}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="phoneNumber">Số điện thoại</Label>
          <Input
            id="phoneNumber"
            {...register("phoneNumber")}
            placeholder="+84XXXXXXXXX hoặc 0XXXXXXXXX"
          />
          {errors.phoneNumber && (
            <p className="text-red-500">
              {errors.phoneNumber?.message?.toString()}
            </p>
          )}
        </div>
        <div>
          <Label className="mb-2 block" htmlFor="address">
            Địa chỉ
          </Label>
          <Input
            id="address"
            {...register("address")}
            placeholder="Ví dụ: Số 20 đường A"
          />
          {errors.address && (
            <p className="text-red-500">
              {errors.address?.message?.toString()}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="mb-2 block" htmlFor="province">
              Tỉnh thành
            </Label>
            <Controller
              render={({ field }) => (
                <>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tỉnh thành" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((province) => (
                        <SelectItem key={province.label} value={province.label}>
                          {province.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.province && (
                    <p className="text-red-500">
                      {errors.province?.message?.toString()}
                    </p>
                  )}
                </>
              )}
              name="province"
              control={control}
            />
          </div>
          <div>
            <Label className="mb-2 block" htmlFor="district">
              Quận huyện
            </Label>
            <Controller
              render={({ field }) => (
                <>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn quận huyện" />
                    </SelectTrigger>
                    <SelectContent>
                      {listDistrict.map((district: any) => (
                        <SelectItem key={district.key} value={district.label}>
                          {district.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.district && (
                    <p className="text-red-500">
                      {errors.district?.message?.toString()}
                    </p>
                  )}
                </>
              )}
              name="district"
              control={control}
            />
          </div>
          <div>
            <Label className="mb-2 block" htmlFor="ward">
              Phường xã
            </Label>
            <Controller
              render={({ field }) => (
                <>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phường xã" />
                    </SelectTrigger>
                    <SelectContent>
                      {listWard.map((district: any) => (
                        <SelectItem key={district.key} value={district.label}>
                          {district.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ward && (
                    <p className="text-red-500">
                      {errors.ward?.message?.toString()}
                    </p>
                  )}
                </>
              )}
              name="ward"
              control={control}
            />
          </div>
          <Button
            variant="link"
            className="p-0 m-0 !w-fit underline text-lime-600 hover:text-lime-700"
            onClick={() => saveShippingAddress()}
            type="button"
          >
            Lưu địa chỉ
          </Button>
        </div>
        <div>
          <Label className="mb-2 block" htmlFor="note">
            Ghi chú
          </Label>
          <Input id="note" {...register("note")} />
        </div>
        {/* Shipping Method */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Vận chuyển</h2>
        <div className="bg-blue-50 p-4 rounded-md text-sm">
          Vui lòng nhập thông tin giao hàng
        </div>
      </div> */}

        {/* Payment Method */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Thanh toán</h2>
        <RadioGroup defaultValue="cod">
          <div className="flex items-center space-x-2 border p-4 rounded-md">
            <RadioGroupItem value="cod" id="cod" />
            <Label className="mb-2 block" htmlFor="cod">Thanh toán khi giao hàng (COD)</Label>
          </div>
        </RadioGroup>
      </div> */}
      </div>
    </div>
  );
}
