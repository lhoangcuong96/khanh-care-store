"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Home, MapPin, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileNav from "./mobile-nav";

export default function Header() {
  return (
    <header className="w-full bg-white flex items-center  justify-center border-b shadow-sm sticky top-0 z-50">
      <div className="container max-w-[1290px] px-4 py-4">
        <div className="flex flex-col gap-4">
          {/* Top bar with logo, search and icons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <MobileNav />
                </SheetContent>
              </Sheet>

              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/images/icons/logo-header.png"
                  width="125"
                  height="39"
                  alt="logo"
                ></Image>
              </Link>
            </div>

            <div className="hidden md:flex items-center flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Tìm kiếm tại đây"
                  className="w-full pr-20 border-gray-300 rounded-r-none"
                />
                <Button className="absolute right-0 top-0 h-full rounded-l-none bg-blue-600 hover:bg-blue-700">
                  Tìm kiếm
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="hidden md:flex flex-col items-center text-gray-600 hover:text-primary"
              >
                <Home className="h-6 w-6" />
                <span className="sr-only">Trang chủ</span>
              </Link>

              <Link
                href="/locations"
                className="hidden md:flex flex-col items-center text-gray-600 hover:text-primary"
              >
                <MapPin className="h-6 w-6" />
                <span className="sr-only">Địa điểm</span>
              </Link>

              <Link
                href="/cart"
                className="flex flex-col items-center text-gray-600 hover:text-primary"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="sr-only">Giỏ hàng</span>
              </Link>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden relative w-full">
            <Input
              type="search"
              placeholder="Tìm kiếm tại đây"
              className="w-full pr-20 border-gray-300 rounded-r-none"
            />
            <Button className="absolute right-0 top-0 h-full rounded-l-none bg-blue-600 hover:bg-blue-700">
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
