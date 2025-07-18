import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import { Suspense } from "react";
import ProfileContent from "./profile-content";
import { Loader2 } from "lucide-react";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Trang khách hàng | KCS",
    description: "Trang khách hàng",
  };
};

export default async function Profile() {
  return (
    <Card className="w-full mx-auto px-4 :py-2 sm:px-8 h-fit rounded-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Hồ Sơ Của Tôi</CardTitle>
        <p className="text-sm text-muted-foreground">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
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
          <ProfileContent></ProfileContent>
        </Suspense>
      </CardContent>
    </Card>
  );
}
