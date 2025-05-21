"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Mock news data
const mockNews = [
  {
    id: 1,
    title: "Khuyến mãi lớn cuối tuần!",
    image: "/images/news1.jpg",
    summary:
      "Đừng bỏ lỡ chương trình khuyến mãi cực lớn vào cuối tuần này với hàng ngàn sản phẩm giảm giá.",
  },
  {
    id: 2,
    title: "Cách chọn sản phẩm phù hợp cho gia đình bạn",
    image: "/images/news2.jpg",
    summary:
      "Hướng dẫn chi tiết giúp bạn lựa chọn sản phẩm tốt nhất cho nhu cầu của gia đình.",
  },
  {
    id: 3,
    title: "Xu hướng tiêu dùng năm 2024",
    image: "/images/news3.jpg",
    summary:
      "Khám phá những xu hướng tiêu dùng nổi bật sẽ lên ngôi trong năm 2024.",
  },
];

function NewsSection() {
  return (
    <section className="mt-12 mb-8 w-full max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">
        Tin tức mới nhất
      </h2>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-8"
      >
        {mockNews.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="bg-white rounded-xl shadow p-4 flex flex-col hover:scale-105 hover:shadow-xl transition-transform transition-shadow duration-200 cursor-pointer">
              <Image
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-cover rounded mb-3"
                width={200}
                height={130}
              />
              <h4 className="font-semibold text-lg mb-2 line-clamp-2">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-3">
                {item.summary}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default NewsSection;
