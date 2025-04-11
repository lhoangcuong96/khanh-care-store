"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { routePath } from "@/constants/routes";
import { useAppContext } from "@/provider/app-provider";
import { Menu, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { menuItems } from "./menu";
import { useRouter, useSearchParams } from "next/navigation";

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, account } = useAppContext();

  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = () => {
    if (searchRef.current) {
      const paramsObject: Record<string, string | string[]> = {};

      // Process search params to support multiple values per key
      searchParams.forEach((value, key) => {
        if (paramsObject[key]) {
          paramsObject[key] = Array.isArray(paramsObject[key])
            ? [...paramsObject[key], value] // Append new values to existing array
            : [paramsObject[key], value]; // Convert single value to array
        } else {
          paramsObject[key] = value; // Store as string initially
        }
      });
      paramsObject["search"] = searchRef.current.value;
      console.log(paramsObject);
      router.push(
        routePath.customer.products({
          ...paramsObject,
        })
      );
    }
  };

  return (
    <header className="max-w-screen-xl w-full h-fit mt-5 relative z-50 font-medium block lg:hidden">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 h-24">
          <div className="flex items-center justify-between h-16">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-lime-600">
                  <Menu className="!h-6 !w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0 font-medium">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <Image
                      src="/images/logo-3.jpeg"
                      alt="Heo sạch nhà Thoa"
                      width={120}
                      height={120}
                      className="mx-auto"
                    />
                  </div>
                  <div className="grid gap-2 p-4">
                    {!!account?.id ? (
                      <>
                        <Link
                          href={routePath.customer.account.profile}
                          className="flex items-center py-2"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button className="w-full bg-lime-600 hover:bg-lime-600/90">
                            Tài khoản
                          </Button>
                        </Link>
                        <Link
                          href={routePath.signOut}
                          className="flex items-center py-2"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button className="w-full bg-lime-600 hover:bg-lime-600/90">
                            Đăng xuất
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Button
                          className="w-full bg-lime-600 hover:bg-lime-600/90"
                          onClick={() => setIsOpen(false)}
                        >
                          Đăng ký
                        </Button>
                        <Button
                          className="w-full bg-lime-600 hover:bg-lime-600/90"
                          onClick={() => setIsOpen(false)}
                        >
                          Đăng nhập
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="p-4 border-b">
                    <h3 className="font-bold text-lime-600 mb-4">MENU CHÍNH</h3>
                    <nav className="space-y-2">
                      {menuItems.map((item) => (
                        <Link
                          href={item.path}
                          className="flex items-center py-2"
                          key={item.label}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                  <div className="p-4">
                    <nav className="space-y-2">
                      <Link
                        href="/he-thong-cua-hang"
                        className="flex items-center py-2"
                      >
                        Hệ thống cửa hàng
                      </Link>
                      <Link
                        href="/san-pham-yeu-thich"
                        className="flex items-center py-2"
                      >
                        Sản phẩm yêu thích
                      </Link>
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link href={routePath.customer.home} className="flex items-center">
              <Image
                src="/images/logo-3.jpeg"
                alt="Heo sạch nhà Thoa"
                width={96}
                height={96}
              />
            </Link>

            <div className="flex items-center gap-2">
              <Link href={routePath.customer.cart}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-lime-600 relative"
                >
                  <ShoppingBag className="!h-6 !w-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart?.items.length || 0}
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="relative">
          <Input
            placeholder="Bạn muốn tìm gì..."
            className="w-full pl-4 pr-10 border-lime-600"
            ref={searchRef}
            defaultValue={searchParams.get("search") || ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                return handleSearch();
              }
            }}
          />
          <Button
            size="icon"
            className="absolute right-0 top-0 h-full bg-lime-600 hover:bg-lime-600/90 rounded-l-none"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
