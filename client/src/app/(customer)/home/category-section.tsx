"use client";

import DefaultButton from "@/components/customer/UI/button/default-button";
import OutlineButton from "@/components/customer/UI/button/outline-button";
import { ProductCard } from "@/components/customer/UI/card/product-card";
import { CategoriesWithProductsResponse } from "@/services/category";
import Image from "next/image";
import { useEffect, useReducer, useRef } from "react";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

interface ComponentState {
  isDisabledNext: boolean;
  isDisabledPrev: boolean;
}

enum ActionType {
  DISABLE_NEXT_BUTTON = "DISABLE_NEXT_BUTTON",
  DISABLE_PREV_BUTTON = "DISABLE_PREV_BUTTON",
}

const INITIAL_STATE: ComponentState = {
  isDisabledNext: true,
  isDisabledPrev: true,
};

const reducer = (
  state: ComponentState,
  action: { type: ActionType; value: boolean }
) => {
  switch (action.type) {
    case ActionType.DISABLE_NEXT_BUTTON:
      return {
        ...state,
        isDisabledNext: action.value,
      };

    case ActionType.DISABLE_PREV_BUTTON:
      return {
        ...state,
        isDisabledPrev: action.value,
      };

    default:
      throw Error("Unknown action.");
  }
};

export default function CategorySection({
  category,
  index,
}: {
  category: CategoriesWithProductsResponse;
  index: number;
}) {
  const swiperRef = useRef<SwiperRef | null>(null);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    if (swiperRef.current?.swiper) {
      dispatch({
        type: ActionType.DISABLE_NEXT_BUTTON,
        value: swiperRef.current.swiper.isEnd,
      });
      dispatch({
        type: ActionType.DISABLE_PREV_BUTTON,
        value: swiperRef.current.swiper.isBeginning,
      });
    }
  }, [swiperRef]);

  return (
    <div key={category.id} className="mb-14">
      {category.image?.gallery?.length ? (
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={5}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          autoplay={true}
          onSlideChange={(swiper) => {
            dispatch({
              type: ActionType.DISABLE_NEXT_BUTTON,
              value: swiper.isEnd,
            });
            dispatch({
              type: ActionType.DISABLE_PREV_BUTTON,
              value: swiper.isBeginning,
            });
          }}
        >
          {category.image.gallery.map((image) => {
            return (
              <SwiperSlide key={image} className="p-2">
                <Image
                  width={410}
                  height={200}
                  src={image}
                  alt={category.description || ""}
                  loading="lazy"
                ></Image>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <Image
          src={category.image?.banner || ""}
          width={1280}
          height={330}
          alt={category.description || ""}
          className="rounded-md max-h-96 object-cover"
        ></Image>
      )}

      <div
        className={`flex ${
          index % 2 === 0 ? "flex-row" : "flex-row-reverse"
        } mt-11 gap-5`}
      >
        <Image
          src={category.image?.featured || ""}
          width={295}
          height={440}
          alt={category.description || ""}
          className={`rounded-md xl:block hidden`}
        ></Image>
        <div className={`flex flex-col`}>
          <div className="flex flex-row justify-between mb-5 pb-4 border-b-[0.5px] border-b-lime-600">
            <h3 className=" text-lime-600 text-2xl font-bold flex flex-row items-center gap-2">
              {category.name}
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
                disabled={state.isDisabledPrev}
                onClick={() => swiperRef.current?.swiper.slidePrev()}
              ></DefaultButton>
              <DefaultButton
                className="!h-8 !w-8 !p-0 !min-w-8"
                suffix={
                  <MdOutlineNavigateNext className="!h-5 !w-5"></MdOutlineNavigateNext>
                }
                disabled={state.isDisabledNext}
                onClick={() => swiperRef.current?.swiper.slideNext()}
              ></DefaultButton>
            </div>
          </div>
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={5}
            slidesPerView={4}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            autoplay={true}
            onSlideChange={(swiper) => {
              dispatch({
                type: ActionType.DISABLE_NEXT_BUTTON,
                value: swiper.isEnd,
              });
              dispatch({
                type: ActionType.DISABLE_PREV_BUTTON,
                value: swiper.isBeginning,
              });
            }}
            className="xl:max-w-[calc(1280px_-_310px)] max-w-screen w-screen"
          >
            {category?.products &&
              category?.products.map((product) => {
                return (
                  <SwiperSlide key={product.id} className="p-2">
                    <ProductCard product={product}></ProductCard>
                  </SwiperSlide>
                );
              })}
          </Swiper>
          <OutlineButton className="mt-4 m-auto block">
            Xem tất cả
          </OutlineButton>
        </div>
      </div>
    </div>
  );
}
