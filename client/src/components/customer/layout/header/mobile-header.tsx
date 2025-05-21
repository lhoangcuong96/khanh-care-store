"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { routePath } from "@/constants/routes";
import { useAppContext } from "@/provider/app-provider";
import { ChevronDown, Menu, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { menuItems } from "./menu";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [openProductMenu, setOpenProductMenu] = useState(false);
  const { cart, account, categories } = useAppContext();

  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = () => {
    if (searchRef.current) {
      const searchQuery = searchRef.current.value.trim();
      if (searchQuery) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <header className="max-w-screen-xl w-full h-fit mt-5 relative z-50 font-medium block lg:hidden">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 h-24">
          <div className="flex items-center justify-between h-16">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-600">
                  <Menu className="!h-6 !w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0 font-medium">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <Image
                      src="/images/logo.png"
                      width="124"
                      height="39"
                      alt="logo"
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
                          <Button className="w-full bg-slate-600 hover:bg-slate-600/90">
                            Tài khoản
                          </Button>
                        </Link>
                        <Link
                          href={routePath.signOut}
                          className="flex items-center py-2"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button className="w-full bg-slate-600 hover:bg-slate-600/90">
                            Đăng xuất
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Button
                          className="w-full bg-slate-600 hover:bg-slate-600/90"
                          onClick={() => setIsOpen(false)}
                        >
                          Đăng ký
                        </Button>
                        <Button
                          className="w-full bg-slate-600 hover:bg-slate-600/90"
                          onClick={() => setIsOpen(false)}
                        >
                          Đăng nhập
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="p-4 border-b h-full overflow-y-auto">
                    <h3 className="font-bold text-slate-600 mb-4">
                      MENU CHÍNH
                    </h3>
                    <nav className="space-y-2">
                      {menuItems.map((item) => {
                        if (item.key === "product") {
                          return (
                            <Collapsible
                              key={item.key}
                              open={openProductMenu}
                              onOpenChange={setOpenProductMenu}
                              className="w-full"
                            >
                              <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                                <span>{item.label}</span>
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${
                                    openProductMenu
                                      ? "transform rotate-180"
                                      : ""
                                  }`}
                                />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pl-4 space-y-2">
                                {categories.map((category) => (
                                  <div key={category.id} className="py-1">
                                    <Link
                                      href={`/products?category=${category.id}`}
                                      className="block"
                                      onClick={() => setIsOpen(false)}
                                    >
                                      {category.name}
                                    </Link>
                                    {category.children &&
                                      category.children.length > 0 && (
                                        <div className="pl-4 space-y-1 mt-1">
                                          {category.children.map((child) => (
                                            <Link
                                              key={child.id}
                                              href={`/products?category=${child.id}`}
                                              className="block py-1 text-sm text-gray-600"
                                              onClick={() => setIsOpen(false)}
                                            >
                                              {child.name}
                                            </Link>
                                          ))}
                                        </div>
                                      )}
                                  </div>
                                ))}
                              </CollapsibleContent>
                            </Collapsible>
                          );
                        }
                        return (
                          <Link
                            href={item.path}
                            className="flex items-center py-2"
                            key={item.label}
                            onClick={() => setIsOpen(false)}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
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
                src="/images/logo.png"
                width="124"
                height="39"
                alt="logo"
                className="pointer"
              ></Image>
            </Link>

            <div className="flex items-center gap-2">
              <Link href={routePath.customer.cart}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-600 relative"
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
            className="w-full pl-4 pr-10 border-slate-600"
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
            className="absolute right-0 top-0 h-full bg-slate-600 hover:bg-slate-600/90 rounded-l-none"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
