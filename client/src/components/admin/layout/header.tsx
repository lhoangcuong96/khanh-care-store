"use client";
import { Sidebar } from "@/app/admin/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { routePath } from "@/constants/routes";
import { useAppContext } from "@/provider/app-provider";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header() {
  const { account } = useAppContext();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false);
    }
  };

  // const handleMobileSearch = () => {
  //   setIsMobileSearchOpen(true);
  // };

  return (
    <header className="border-b sticky top-0 z-50 bg-slate-600">
      <div className="flex justify-between h-16 items-center px-2 sm:px-4">
        {/* Sidebar Toggle Button (Mobile Only) */}
        <button
          type="button"
          className="md:hidden mr-2 p-2 rounded-md hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6 text-white" />
        </button>
        {/* Logo Section */}
        <div className="flex-shrink-0 w-32 md:w-48 lg:w-64 px-1 md:px-2 m-auto lg:m-0">
          <Link
            href={routePath.admin.home}
            className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 md:relative md:top-0 md:left-0 md:translate-x-0"
          >
            <Image
              src="/images/logo.png"
              width="124"
              height="39"
              alt="logo"
              className="w-auto h-8 md:h-10"
            />
          </Link>
        </div>

        {/* Search Section */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-2xl mx-2 md:mx-4 hidden md:block"
        >
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng..."
              className="pl-8 bg-white/10 text-white placeholder:text-white/50 border-white/20 focus:bg-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Mobile Search Button */}
        {/* <div className="sm:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={handleMobileSearch}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div> */}

        {/* Right Section */}
        <div className="flex items-center space-x-1 text-white">
          {/* Notification and Help - Hidden on mobile */}
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            {/* <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button> */}
          </div>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3"
              >
                <Avatar className="h-7 w-7 md:h-8 md:w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="@username" />
                  <AvatarFallback className="text-slate-600 text-xs md:text-sm">
                    {account?.fullname?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm lg:text-base">
                  {account?.fullname}
                </span>
                <ChevronDown className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/profile"
                  className="flex items-center cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Hồ sơ</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/settings"
                  className="flex items-center cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Cài đặt</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/sign-out"
                  className="flex items-center cursor-pointer text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Sidebar Dialog */}
      <Dialog open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <DialogContent className="p-0 max-w-xs w-fit h-full rounded-none md:hidden translate-x-0 translate-y-0 top-0 left-0">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={50}
            height={50}
            className="w-auto h-10 object-contain mt-8 ml-6"
          />
          <Sidebar
            className="w-64 h-full overflow-y-scroll"
            onClose={() => setIsSidebarOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Mobile Search Dialog */}
      <Dialog open={isMobileSearchOpen} onOpenChange={setIsMobileSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tìm kiếm</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full">
              Tìm kiếm
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
}
