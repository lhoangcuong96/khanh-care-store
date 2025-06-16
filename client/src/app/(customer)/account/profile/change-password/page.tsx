import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import ChangePasswordForm from "./change-password-form";
import { Loader2 } from "lucide-react";

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
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          }
        >
          <ChangePasswordForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}
