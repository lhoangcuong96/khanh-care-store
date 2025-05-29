"use client";

import DefaultButton from "@/components/customer/UI/button/default-button";
import { ErrorMessage } from "@/components/customer/UI/error-message";
import { routePath } from "@/constants/routes";
import { NewsInListType } from "@/validation-schema/news.schema";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import "swiper/css";
import "swiper/css/navigation";
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

function NewsSection({ news }: { news: NewsInListType[] }) {
  const swiperRef = useRef<SwiperClass>(null);

  return (
    <section className="mt-12 mb-8 w-full max-w-screen-xl mx-auto">
      <div className="flex flex-row justify-between mb-5 pb-4 border-b-[0.5px] border-b-slate-600">
        <Link href={routePath.customer.news}>
          <h3 className=" text-slatee-600 text-2xl font-bold flex flex-row items-center gap-2">
            Tin tức mới nhất
          </h3>
        </Link>

        <div className="flex flex-row items-center justify-center">
          <DefaultButton
            className="!h-8 !w-8 !p-0 !min-w-8"
            suffix={
              <MdOutlineNavigateBefore className="!h-5 !w-5"></MdOutlineNavigateBefore>
            }
            onClick={() => swiperRef.current?.slidePrev()}
          ></DefaultButton>
          <DefaultButton
            className="!h-8 !w-8 !p-0 !min-w-8"
            suffix={
              <MdOutlineNavigateNext className="!h-5 !w-5"></MdOutlineNavigateNext>
            }
            onClick={() => swiperRef.current?.slideNext()}
          ></DefaultButton>
        </div>
      </div>
      {news.length === 0 && (
        <ErrorMessage className="text-center">
          Không tìm thấy tin tức mới nhất
        </ErrorMessage>
      )}
      {news.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination, A11y, Autoplay]}
          spaceBetween={10}
          slidesPerView={"auto"}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          autoplay={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="!pb-8"
          onSwiper={(ref) => (swiperRef.current = ref)}
        >
          {news.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="bg-white rounded-xl shadow p-4 flex flex-col hover:scale-105 hover:shadow-xl transition-transform transition-shadow duration-200 cursor-pointer">
                <Image
                  src={item.image.thumbnail}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded mb-3"
                  width={200}
                  height={130}
                />
                <h4
                  className="font-semibold text-lg mb-2 line-clamp-2"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: "2",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {item.summary}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}

export default NewsSection;
