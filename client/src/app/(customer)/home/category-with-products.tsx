"use client";

import DefaultButton from "@/components/customer/UI/button/default-button";
import OutlineButton from "@/components/customer/UI/button/outline-button";
import { ProductCard } from "@/components/customer/UI/card/product-card";
import { ErrorMessage } from "@/components/customer/UI/error-message";
import { routePath } from "@/constants/routes";
import { ProductInListType } from "@/validation-schema/product";
import { CategoryWithProductsType } from "@/validation-schema/landing";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useReducer, useRef, useState } from "react";
import { FaTools } from "react-icons/fa";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import ProductDetailModal from "@/components/customer/UI/modal/product-detail-modal";
import { useRouter } from "next/navigation";

interface CategoryWithProductsProps {
  category: CategoryWithProductsType;
  products: ProductInListType[];
  handleAddToFavorite: (id: string) => void;
  handleRemoveFromFavorite: (id: string) => void;
  error?: string;
}

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

export function CategoryWithProducts({
  category,
  products,
  handleAddToFavorite,
  handleRemoveFromFavorite,
  error,
}: CategoryWithProductsProps) {
  const swiperRef = useRef<SwiperRef | null>(null);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
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

  const handleSearchClick = (product: any) => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      setSelectedProduct(product);
      setModalOpen(true);
    } else {
      router.push(`${routePath.customer.productDetail}/${product.slug}`);
    }
  };

  return (
    <div
      className={`max-w-full w-screen h-fit mt-5 relative z-50 grid md:gap-8`}
    >
      <div className="w-full max-w-full overflow-hidden">
        {category.image.banner && (
          <Link
            href={routePath.customer.products({
              category: category.id,
            })}
          >
            <Image
              src={category.image.banner}
              alt={category.name}
              width={1200}
              height={300}
              className="w-full object-cover aspect-[4/1] mb-5 rounded-lg"
            />
          </Link>
        )}
        <div className="flex flex-row justify-between mb-5 pb-4 border-b-[0.5px] border-b-slate-600 gap-4">
          <h3 className=" text-slatee-600 text-2xl font-bold flex flex-row items-center gap-2">
            <Link
              href={routePath.customer.products({
                category: category.id,
              })}
            >
              {category.name}
            </Link>
            <FaTools className="text-slate-600"></FaTools>
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
        {error && (
          <ErrorMessage className="text-center leading-10">
            {error}
          </ErrorMessage>
        )}
        {!error && category.products.length === 0 && (
          <ErrorMessage className="text-center leading-10">
            Không có sản phẩm nào phù hợp.
          </ErrorMessage>
        )}
        {!error && products.length > 0 && (
          <>
            <Swiper
              ref={swiperRef}
              modules={[Pagination, A11y, Autoplay]}
              spaceBetween={10}
              slidesPerView={"auto"}
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
              className="w-full"
            >
              {category.products.map((product) => {
                return (
                  <SwiperSlide key={product.id} className="p-2 !w-fit !mr-2">
                    <ProductCard
                      product={product}
                      onSearchClick={() => handleSearchClick(product)}
                      handleAddToFavorite={handleAddToFavorite}
                      handleRemoveFromFavorite={handleRemoveFromFavorite}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
            <Link
              href={routePath.customer.products({
                category: category.id,
              })}
            >
              <OutlineButton className="mt-4 m-auto block">
                Xem tất cả
              </OutlineButton>
            </Link>
          </>
        )}
        <ProductDetailModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          product={selectedProduct as any}
        />
      </div>
    </div>
  );
}
