"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>NH</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Nguyễn Văn Hùng</p>
          <p className="text-sm text-muted-foreground">hung@example.com</p>
        </div>
        <div className="ml-auto font-medium">+5.200.000 ₫</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>TL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Trần Thị Lan</p>
          <p className="text-sm text-muted-foreground">lan@example.com</p>
        </div>
        <div className="ml-auto font-medium">+2.500.000 ₫</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>PD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Phạm Văn Đức</p>
          <p className="text-sm text-muted-foreground">duc@example.com</p>
        </div>
        <div className="ml-auto font-medium">+3.800.000 ₫</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>LH</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Lê Thị Hoa</p>
          <p className="text-sm text-muted-foreground">hoa@example.com</p>
        </div>
        <div className="ml-auto font-medium">+1.500.000 ₫</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt="Avatar" />
          <AvatarFallback>DT</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Đỗ Minh Tuấn</p>
          <p className="text-sm text-muted-foreground">tuan@example.com</p>
        </div>
        <div className="ml-auto font-medium">+4.000.000 ₫</div>
      </div>
    </div>
  );
}
