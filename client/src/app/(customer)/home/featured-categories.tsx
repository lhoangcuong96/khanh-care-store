"use client";

import DefaultButton from "@/components/customer/UI/button/default-button";
import CategoryCard from "@/components/customer/UI/card/category-card";
import { ErrorMessage } from "@/components/customer/UI/error-message";
import { routePath } from "@/constants/routes";
import useCategory from "@/hooks/modules/use-category";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
  Virtual,
} from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

export function FeaturedCategories() {
  const { categories } = useCategory();
  const swiperRef = useRef<SwiperClass>(null);

  return (
    <div className="max-w-full w-screen h-fit mt-5 relative z-50">
      <div className="flex flex-row justify-between mb-5 pb-4 border-b-[0.5px] border-b-lime-600">
        <h3 className=" text-lime-600 text-2xl font-bold flex flex-row items-center gap-2">
          Danh mục nổi bật
          <Image
            src="/images/icons/leaf.webp"
            alt="icon"
            width={25}
            height={25}
          ></Image>
        </h3>
        <div className="flex flex-row items-center justify-center">
          <DefaultButton
            className="!h-8 !w-8 !p-0 !min-w-8"
            suffix={
              <MdOutlineNavigateBefore className="!h-5 !w-5"></MdOutlineNavigateBefore>
            }
            disabled={swiperRef.current?.isBeginning}
            onClick={() => swiperRef.current?.slidePrev()}
          ></DefaultButton>
          <DefaultButton
            className="!h-8 !w-8 !p-0 !min-w-8"
            suffix={
              <MdOutlineNavigateNext className="!h-5 !w-5"></MdOutlineNavigateNext>
            }
            disabled={swiperRef.current?.isEnd}
            onClick={() => swiperRef.current?.slideNext()}
          ></DefaultButton>
        </div>
      </div>

      {!categories || !categories.length ? (
        <ErrorMessage>Lỗi khi lấy dữ liệu dang mục</ErrorMessage>
      ) : (
        <div>
          <Swiper
            onSwiper={(ref) => (swiperRef.current = ref)}
            onSlideChange={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[
              Navigation,
              Pagination,
              Scrollbar,
              A11y,
              Autoplay,
              Virtual,
            ]}
            spaceBetween={0}
            slidesPerView="auto"
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            autoplay={true}
          >
            {categories.map((category) => {
              return (
                <SwiperSlide key={category.id} className="!w-fit !m-2">
                  <Link
                    href={`${routePath.customer.products({
                      category: category.slug,
                    })}`}
                  >
                    <CategoryCard category={category} key={category.id} />
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </div>
  );
}
