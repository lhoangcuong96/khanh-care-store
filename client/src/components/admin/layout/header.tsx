"use client";
import { Bell, HelpCircle, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { routePath } from "@/constants/routes";
import { useAppContext } from "@/provider/app-provider";

export function Header() {
  const { account } = useAppContext();
  return (
    <header className="border-b sticky top-0 z-50 bg-white">
      <div className="flex h-16 items-center px-4">
        <div className="w-64 px-2">
          <Link href={routePath.admin.statistic}>
            <Image
              src="/images/logo-3.jpeg"
              width="56"
              height="56"
              alt="logo"
            ></Image>
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" alt="@username" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
            <span>{account?.fullname}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
