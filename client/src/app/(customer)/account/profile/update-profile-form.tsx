"use client";

import {
  AccountType,
  UpdateProfileBody,
  UpdateProfileBodyType,
} from "@/validation-schema/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate } from "date-fns";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { accountApiRequest } from "@/api-request/account";
import { storageRequestApis } from "@/api-request/storage";
import DefaultButton from "@/components/customer/UI/button/default-button";
import { FormError } from "@/components/customer/UI/input/form/form-error";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/components/ui/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { routePath } from "@/constants/routes";
import { useAppContext } from "@/provider/app-provider";
import { useHandleMessage } from "@/hooks/use-handle-message";
import { Account } from "@prisma/client";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UpdateProfileForm({
  profile,
}: {
  profile: AccountType;
}) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { messageApi } = useHandleMessage();
  const { setAccount } = useAppContext();
  const router = useRouter();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      // 10MB limit
      setAvatarFile(file);
    } else {
      alert("File size must be less than 10MB");
    }
  };
  const { control, register, handleSubmit, setError } =
    useForm<UpdateProfileBodyType>({
      resolver: zodResolver(UpdateProfileBody),
      defaultValues: {
        ...profile,
        gender: profile.gender || "OTHER",
        dateOfBirth: profile.dateOfBirth
          ? formatDate(profile.dateOfBirth, "yyyy-MM-dd")
          : "",
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
      },
    });

  const onSubmit = async (data: UpdateProfileBodyType) => {
    try {
      setIsLoading(true);
      let avatar = "";
      if (avatarFile) {
        const generatePresignedUrlRes =
          await storageRequestApis.generatePresignedUrl(
            avatarFile.name,
            avatarFile.type
          );
        if (!generatePresignedUrlRes.payload?.data) {
          throw new Error("Lỗi upload avatar");
        }
        const { fileUrl, presignedUrl } = generatePresignedUrlRes.payload.data;
        await storageRequestApis.upload(presignedUrl, avatarFile);
        avatar = fileUrl;
      }
      const dateOfBirth = new Date(data.dateOfBirth) as unknown as string;
      const res = await accountApiRequest.updateProfile({
        ...data,
        avatar: avatar || profile.avatar,
        dateOfBirth,
      });
      if (res.payload?.data) {
        setAccount(res.payload?.data as Account);
        messageApi.success({ description: "Cập nhật thông tin thành công" });
        router.refresh();
      } else {
        messageApi.error({
          error: "Cập nhật thông tin thất bại",
        });
      }
    } catch (error) {
      messageApi.error({ error: error as Error, setError });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      className="flex flex-col-reverse md:flex-row gap-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex-1 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-[100px_auto] gap-2">
          <Label htmlFor="fullname" className="mt-2">
            Họ và tên
          </Label>
          <Controller
            name="fullname"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <div className="grid w-full">
                  <Input
                    error={fieldState.error?.message}
                    {...field}
                    value={field.value || ""}
                    className="block"
                  />
                  {fieldState.error?.message && (
                    <FormError error={fieldState.error?.message} />
                  )}
                </div>
              );
            }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[100px_auto] gap-2">
          <Label htmlFor="email" className="">
            Email
          </Label>
          <div className="flex items-center gap-4 !m-0 w-full">
            <p>{profile.email}</p>
            <Link href={routePath.customer.account.changePassword}>
              Thay Đổi
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[100px_auto] gap-2">
          <Label htmlFor="phone" className="">
            Số điện thoại
          </Label>
          <div className="flex items-center gap-4 !m-0 w-full">
            <p>{profile.phoneNumber}</p>
            <Link href={routePath.customer.account.changePassword}>
              Thay Đổi
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[100px_auto] gap-2">
          <Label htmlFor="password" className="">
            Mật khẩu
          </Label>
          <div className="flex items-center gap-4 !m-0 w-full">
            <p>*******************</p>
            <Link href={routePath.customer.account.changePassword}>
              Thay Đổi
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[100px_auto] gap-2">
          <Label className="w-28">Giới tính</Label>
          <RadioGroup
            className="flex gap-4"
            defaultValue={profile.gender || "OTHER"}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="MALE" id="MALE" {...register("gender")} />
              <Label htmlFor="nam">Nam</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="FEMALE"
                id="FEMALE"
                {...register("gender")}
              />
              <Label htmlFor="nu">Nữ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="OTHER"
                id="OTHER"
                {...register("gender")}
              />
              <Label htmlFor="khac">Khác</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[100px_auto] gap-2">
          <Label htmlFor="birthday" className="mt-2">
            Ngày sinh
          </Label>
          <div className="flex items-center gap-2 !m-0 w-full">
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <div className="grid w-full">
                    <Input
                      id="birthday"
                      type="date"
                      className="!w-fit"
                      error={fieldState.error?.message}
                      {...field}
                      value={field.value.toString() || ""}
                    />
                    {fieldState.error?.message && (
                      <FormError
                        error={fieldState.error?.message}
                        className="mt-[4px]"
                      />
                    )}
                  </div>
                );
              }}
            />
          </div>
        </div>

        <DefaultButton
          className="mt-6 justify-self-center md:justify-self-start"
          disabled={isLoading}
        >
          {isLoading ? (
            <p className="loading-animation">Đang cập nhật</p>
          ) : (
            <p>Cập nhật thông tin</p>
          )}
        </DefaultButton>
      </div>

      <div className="w-full md:w-64 flex flex-col items-center gap-4">
        <Avatar className="w-24 h-24 relative">
          {avatarFile || profile.avatar ? (
            <AvatarImage
              src={
                avatarFile
                  ? URL.createObjectURL(avatarFile)
                  : profile.avatar || ""
              }
              className="object-cover"
            />
          ) : (
            <AvatarFallback>
              <User className="w-12 h-12" />
            </AvatarFallback>
          )}
        </Avatar>
        <div className="text-center">
          <Button
            type="button"
            variant="outline"
            className="relative"
            disabled={isLoading}
            onClick={() => document.getElementById("avatar-upload")?.click()}
          >
            Chọn Ảnh
          </Button>
          <input
            type="file"
            onChange={handleAvatarChange}
            accept="image/*"
            id="avatar-upload"
            className="hidden"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Dụng lượng file tối đa 1 MB
          </p>
          <p className="text-sm text-muted-foreground">Định dạng: JPEG, PNG</p>
        </div>
      </div>
    </form>
  );
}
