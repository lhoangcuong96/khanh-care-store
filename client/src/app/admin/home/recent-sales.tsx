'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

interface Sale {
  name: string;
  email: string;
  amount: string;
  avatar: string;
}

const recentSales: Sale[] = [
  {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    amount: "250.000đ",
    avatar: "/avatars/01.png",
  },
  {
    name: "Trần Thị B",
    email: "tranthib@example.com",
    amount: "450.000đ",
    avatar: "/avatars/02.png",
  },
  {
    name: "Lê Văn C",
    email: "levanc@example.com",
    amount: "150.000đ",
    avatar: "/avatars/03.png",
  },
  {
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    amount: "350.000đ",
    avatar: "/avatars/04.png",
  },
  {
    name: "Hoàng Văn E",
    email: "hoangvane@example.com",
    amount: "550.000đ",
    avatar: "/avatars/05.png",
  },
];

const RecentSales: React.FC = () => {
  return (
    <div className="space-y-8">
      {recentSales.map((sale, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={sale.avatar} alt={sale.name} />
            <AvatarFallback>{sale.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.name}</p>
            <p className="text-sm text-muted-foreground">{sale.email}</p>
          </div>
          <div className="ml-auto font-medium">{sale.amount}</div>
        </div>
      ))}
    </div>
  );
};

export default RecentSales; 