import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { shopInfo } from "@/constants/shop-info";

const brandLogos = [
  { name: "3M", logo: "/brands/3m.png" },
  { name: "ANNOVI REVERBERI", logo: "/brands/annovi.png" },
  { name: "Atlas Copco", logo: "/brands/atlas-copco.png" },
  { name: "KLCB", logo: "/brands/klcb.png" },
  { name: "LIQUI MOLY", logo: "/brands/liqui-moly.png" },
  { name: "MaxShine", logo: "/brands/maxshine.png" },
];

export default function Footer() {
  return (
    <footer className="bg-white w-full flex flex-col items-center justify-center">
      {/* Brand Logos */}
      <div className="container max-w-[1290px] px-4 py-8 mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {brandLogos.map((brand) => (
            <div key={brand.name} className="w-24 md:w-32">
              <Image
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                width={120}
                height={60}
                className="h-auto w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Consultation Form */}
      <div className="relative py-6">
        <div className="container max-w-[1290px] px-4 mx-auto">
          <div className="relative rounded-lg overflow-hidden h-fit">
            <Image
              src="/images/cf7-footer.jpg"
              alt="TAHICO Consultation"
              width={1200}
              height={200}
              className="w-full h-44 md:h-32 object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col md:flex-row items-center justify-between p-4">
              <div className="text-white font-bold mb-4 md:mb-0">
                <p>{shopInfo.name} - TƯ VẤN</p>
                <p>MIỄN PHÍ</p>
              </div>
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <Input
                  type="text"
                  placeholder="Nhập số điện thoại"
                  className="bg-white h-10 md:w-64"
                />
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Đăng ký tư vấn
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Offices */}
      <div className="container max-w-[1290px] bg-white py-6">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-orange-500"></div>
                <h3 className="font-bold">MIỀN NAM</h3>
              </div>
              <p className="text-sm">
                {shopInfo.address} <br />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="w-full bg-blue-800 text-white py-8">
        <div className="container max-w-[1290px] px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Logo and Info */}
            <div className="col-span-1">
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/logo-white.png"
                  alt="TAHICO Logo"
                  width={180}
                  height={60}
                  className="h-auto w-auto"
                />
              </Link>
              <p className="text-sm mb-4">
                Chuyên sản xuất - phân phối thiết bị, dụng dịch làm sạch và dụng
                cụ chăm sóc xe trên toàn quốc.
              </p>
              <div className="flex items-center gap-3 mb-4">
                <Link
                  href="https://facebook.com"
                  className="hover:text-blue-300"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link
                  href="https://instagram.com"
                  className="hover:text-blue-300"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href="https://twitter.com"
                  className="hover:text-blue-300"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link
                  href="https://linkedin.com"
                  className="hover:text-blue-300"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link
                  href="https://youtube.com"
                  className="hover:text-blue-300"
                >
                  <Youtube className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Column 2: Certifications */}
            <div className="col-span-1">
              <h3 className="font-bold text-lg mb-4">
                Đã Thông Báo Bộ Công Thương
              </h3>
              <p className="text-sm mb-2">Số GPKD: 0313337673</p>
              <div className="flex flex-col gap-4">
                <Image
                  src="/images/bo-cong-thuong.png"
                  alt="Bộ Công Thương"
                  width={150}
                  height={56}
                  className="h-auto"
                />
                <Image
                  src="/images/dmca.png"
                  alt="DMCA Protected"
                  width={150}
                  height={56}
                  className="h-auto"
                />
              </div>
            </div>

            {/* Column 3: Company Info */}
            <div className="col-span-1">
              <h3 className="font-bold text-lg mb-4">THÔNG TIN CÔNG TY</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/gioi-thieu"
                    className="text-sm hover:text-blue-300 flex items-center gap-2"
                  >
                    <span>▸</span> Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link
                    href="/lien-he"
                    className="text-sm hover:text-blue-300 flex items-center gap-2"
                  >
                    <span>▸</span> Liên hệ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/chinh-sach-doi-tra"
                    className="text-sm hover:text-blue-300 flex items-center gap-2"
                  >
                    <span>▸</span> Chính sách đổi trả
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dieu-khoan-su-dung"
                    className="text-sm hover:text-blue-300 flex items-center gap-2"
                  >
                    <span>▸</span> Điều khoản sử dụng
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tin-tuc"
                    className="text-sm hover:text-blue-300 flex items-center gap-2"
                  >
                    <span>▸</span> Tin tức
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-sm hover:text-blue-300 flex items-center gap-2"
                  >
                    <span>▸</span> Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ho-tro-tra-gop"
                    className="text-sm hover:text-blue-300 flex items-center gap-2"
                  >
                    <span>▸</span> Hỗ trợ trả góp
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="col-span-1">
              <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-300" />
                  <Link
                    href={`tel:${shopInfo.phone}`}
                    className="underline text-sm"
                  >
                    {shopInfo.phone}
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-300" />
                  <Link
                    href={`mailto:${shopInfo.email}`}
                    className="underline text-sm"
                  >
                    {shopInfo.email}
                  </Link>
                </div>
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Nhận khuyến mãi
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="w-full bg-blue-900 border-t border-blue-800 py-3">
        <div className="container max-w-[1290px] px-4 mx-auto">
          <p className="text-center text-sm text-gray-300">
            Copyright © {new Date().getFullYear()} by{" "}
            <Link href={shopInfo.developer.zalo}>
              {shopInfo.developer.name}
            </Link>{" "}
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
