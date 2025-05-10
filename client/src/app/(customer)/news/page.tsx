import React from "react";
import Image from "next/image";
import Link from "next/link";
import AppBreadcrumb from "@/components/customer/layout/breadcrumb";
import { routePath } from "@/constants/routes";

const newsData = [
  {
    id: 1,
    title: "9 'siêu thực phẩm' cần có trong chế độ ăn uống của người cao tuổi",
    excerpt:
      "Khám phá những thực phẩm giúp tăng cường sức khỏe cho người lớn tuổi...",
    image: "/images/news1.jpg",
    date: "24",
    month: "Tháng 05",
  },
  {
    id: 2,
    title:
      "Gợi ý cách thực hiện chế độ ăn tập gym giảm cân cho người mới bắt đầu",
    excerpt: "Những lưu ý và thực đơn phù hợp cho người mới bắt đầu tập gym...",
    image: "/images/news2.jpg",
    date: "04",
    month: "Tháng 05",
  },
  {
    id: 3,
    title: "Chuối cau là gì? Chuối cau bao nhiêu calo? Tác dụng chuối cau",
    excerpt:
      "Chuối cau là một trong những loại chuối rất phổ biến ở nước ta và được nhiều người yêu thích...",
    image: "/images/news3.jpg",
    date: "04",
    month: "Tháng 05",
  },
  {
    id: 4,
    title: "Tiết lộ thực đơn tăng cân cấp tốc từ 3-5kg cho các nàng gầy",
    excerpt: "Bí quyết tăng cân hiệu quả, an toàn cho người gầy...",
    image: "/images/news4.jpg",
    date: "04",
    month: "Tháng 05",
  },
  {
    id: 5,
    title: "Thực đơn giảm cân 1 tháng, bí kíp giảm cân hiệu quả, an toàn",
    excerpt: "Thực đơn giảm cân khoa học giúp bạn lấy lại vóc dáng...",
    image: "/images/news5.jpg",
    date: "04",
    month: "Tháng 05",
  },
  {
    id: 6,
    title: "Chế độ ăn uống giúp bảo vệ sức khỏe người cao tuổi trong mùa dịch",
    excerpt: "Lời khuyên dinh dưỡng cho người cao tuổi trong mùa dịch...",
    image: "/images/news6.jpg",
    date: "04",
    month: "Tháng 05",
  },
];

const featuredNews = newsData.slice(0, 3);

export default function NewsPage() {
  return (
    <div className="flex flex-col w-full items-center justify-center h-full text-sm font-medium">
      <AppBreadcrumb
        pageTitle={"Liên hệ với chúng tôi"}
        breadcrumbItems={[
          {
            title: "Trang chủ",
            href: routePath.customer.home,
          },
          {
            title: "Liên hệ",
          },
        ]}
      ></AppBreadcrumb>
      <div className="w-screen p-8 flex items-center justify-center h-full">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* News List */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {newsData.map((news) => (
              <div
                key={news.id}
                className="bg-slate-100 rounded-lg overflow-hidden shadow hover:shadow-lg transition relative"
              >
                <div className="relative h-48">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-slate-700 text-white rounded px-2 py-1 text-xs font-semibold text-center">
                    <div>{news.date}</div>
                    <div>{news.month}</div>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="font-bold text-lg mb-2 line-clamp-2">
                    {news.title}
                  </h2>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {news.excerpt}
                  </p>
                  <Link
                    href={`/news/${news.id}`}
                    className="inline-block px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 text-sm font-medium"
                  >
                    Đọc tiếp
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured News */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-1">
                Tin tức nổi bật
                <span role="img" aria-label="leaf">
                  🍃
                </span>
              </h3>
              <ul className="space-y-3">
                {featuredNews.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <Link
                      href={`/news/${item.id}`}
                      className="text-sm font-medium hover:underline line-clamp-2"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
