"use client";

import DefaultButton from "@/components/customer/UI/button/default-button";
import CategoryCard from "@/components/customer/UI/card/category-card";
import { ErrorMessage } from "@/components/customer/UI/error-message";
import { Category } from "@prisma/client";
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

export function NewsSection({
  categories,
  error,
}: {
  categories: Category[];
  error?: string;
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
    <div className="max-w-full w-screen h-fit mt-5 relative z-50">
      <div className="flex flex-row justify-between mb-5 pb-4 border-b-[0.5px] border-b-slate-600">
        <h3 className=" text-slatee-600 text-2xl font-bold flex flex-row items-center gap-2">
          Danh mục nổi bật{" "}
          <Image
            src="/images/icons/leaf.webp"
            alt="icon"
            width={25}
            height={25}
          ></Image>
        </h3>
        <div className="flex flex-row items-center justify-center">
          <DefaultButton
            className="!h-8 !min-w-8 "
            suffix={
              <MdOutlineNavigateBefore className="!h-5 !w-5"></MdOutlineNavigateBefore>
            }
            disabled={state.isDisabledPrev}
            onClick={() => swiperRef.current?.swiper.slidePrev()}
          ></DefaultButton>
          <DefaultButton
            className="!h-8 !min-w-8 "
            suffix={
              <MdOutlineNavigateNext className="!h-5 !w-5"></MdOutlineNavigateNext>
            }
            disabled={state.isDisabledNext}
            onClick={() => swiperRef.current?.swiper.slideNext()}
          ></DefaultButton>
        </div>
      </div>

      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <div>
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={10}
            slidesPerView={6}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            autoplay={true}
          >
            {categories.map((category) => {
              return (
                <SwiperSlide key={category.id}>
                  <CategoryCard category={category} key={category.id} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </div>
  );
}
