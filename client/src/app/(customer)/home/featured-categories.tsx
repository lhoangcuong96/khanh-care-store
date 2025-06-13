"use client";

import DefaultButton from "@/components/customer/UI/button/default-button";
import CategoryCard from "@/components/customer/UI/card/category-card";
import { ErrorMessage } from "@/components/customer/UI/error-message";
import { routePath } from "@/constants/routes";
import Link from "next/link";
import { useReducer, useRef } from "react";
import { FaTools } from "react-icons/fa";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";

import { FeaturedCategoryType } from "@/validation-schema/category";
import { A11y, Autoplay, Pagination, Virtual } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
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

export function FeaturedCategories({
  categories,
  error,
}: {
  categories: FeaturedCategoryType[];
  error?: string;
}) {
  const swiperRef = useRef<SwiperClass>(null);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <div className="max-w-full w-screen h-fit mt-5 relative z-50">
      <div className="flex flex-row justify-between mb-5 pb-4 border-b-[0.5px] border-b-slate-600 gap-4">
        <h3 className=" text-slatee-600 text-2xl font-bold flex flex-row items-center gap-2">
          Danh mục nổi bật
          <FaTools className="text-slate-600"></FaTools>
        </h3>
        <div className="flex flex-row items-center justify-center">
          <DefaultButton
            className="!h-8 !w-8 !p-0 !min-w-8"
            suffix={
              <MdOutlineNavigateBefore className="!h-5 !w-5"></MdOutlineNavigateBefore>
            }
            disabled={state.isDisabledPrev}
            onClick={() => swiperRef.current?.slidePrev()}
          ></DefaultButton>
          <DefaultButton
            className="!h-8 !w-8 !p-0 !min-w-8"
            suffix={
              <MdOutlineNavigateNext className="!h-5 !w-5"></MdOutlineNavigateNext>
            }
            disabled={state.isDisabledNext}
            onClick={() => swiperRef.current?.slideNext()}
          ></DefaultButton>
        </div>
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!error && (!categories || categories.length === 0) && (
        <ErrorMessage className="text-center">
          Không tìm thấy danh mục nổi bật
        </ErrorMessage>
      )}
      {!error && categories && categories.length > 0 && (
        <div>
          <Swiper
            onSwiper={(ref) => (swiperRef.current = ref)}
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
            modules={[Pagination, A11y, Autoplay, Virtual]}
            spaceBetween={0}
            slidesPerView="auto"
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            autoplay={true}
          >
            {categories.map((category) => {
              return (
                <SwiperSlide key={category.id} className="!w-fit !my-2 !mx-4">
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
