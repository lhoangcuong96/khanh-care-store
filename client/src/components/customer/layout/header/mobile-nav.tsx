import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const categories = [
  { name: "Máy rửa xe", href: "/may-rua-xe" },
  { name: "Máy nén khí", href: "/may-nen-khi" },
  { name: "Thiết bị nâng hạ", href: "/thiet-bi-nang-ha" },
  { name: "Bình bọt tuyết", href: "/binh-bot-tuyet" },
  { name: "Chăm sóc xe", href: "/cham-soc-xe" },
  { name: "Nước rửa xe", href: "/nuoc-rua-xe" },
  { name: "Thiết bị làm lốp", href: "/thiet-bi-lam-lop" },
  { name: "Cầu nâng 1 trụ", href: "/cau-nang-1-tru" },
  { name: "Thiết bị Garage", href: "/thiet-bi-garage" },
];

export default function MobileNav() {
  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-4 mb-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/icons/logo-header.png"
            width="125"
            height="39"
            alt="logo"
          ></Image>
        </Link>
      </div>

      <div className="px-4 mb-4">
        <h3 className="font-medium text-lg mb-2">Danh mục</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.href}>
              <Link
                href={category.href}
                className="flex items-center justify-between py-2 text-sm text-muted-foreground hover:text-primary"
              >
                {category.name}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-4 mt-auto">
        <nav className="flex flex-col gap-2">
          <Link href="/" className="py-2 text-sm font-medium text-primary">
            Trang chủ
          </Link>
          <Link
            href="/ve-chung-toi"
            className="py-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Về chúng tôi
          </Link>
          <Link
            href="/du-an-da-lam"
            className="py-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Dự án đã làm
          </Link>
          <Link
            href="/dich-vu"
            className="py-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Dịch vụ
          </Link>
          <Link
            href="/lien-he"
            className="py-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Liên hệ
          </Link>
        </nav>
      </div>
    </div>
  );
}
