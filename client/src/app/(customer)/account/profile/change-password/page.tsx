import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import ChangePasswordForm from "./change-password-form";

export default function ChangePassword() {
  return (
    <Card className="w-full mx-auto py-6 px-8 h-fit rounded-sm">
      <CardHeader>
        <CardTitle className="text-2xl">ĐỔI MẬT KHẨU</CardTitle>
        <p className="text-sm text-muted-foreground">
          Để đảm bảo tính bảo mật bạn vui lòng đặt lại mật khẩu với ít nhất 6 ký
          tự
        </p>
      </CardHeader>
      <CardContent>
        <Suspense fallback="...Loading">
          <ChangePasswordForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}
