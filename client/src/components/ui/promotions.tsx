"use client";

import { useEffect, useReducer, useRef } from "react";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useHandleMessage } from "@/hooks/use-handle-message";
import { Copy, Info } from "lucide-react";

interface Promotion {
  code: string;
  description: string;
  expiry: string;
}

const promotions: Promotion[] = [
  {
    code: "DOLA10",
    description: "Giảm 10.000đ giá trị đơn hàng",
    expiry: "HSD: 1/10/2023",
  },
  {
    code: "FREESHIP",
    description: "Miễn phí vận chuyển",
    expiry: "HSD: Không thời hạn",
  },
  {
    code: "DOLA20",
    description: "Giảm 20% giá trị đơn hàng",
    expiry: "HSD: 1/10/2023",
  },
  {
    code: "DOLA50K",
    description: "Giảm 50k",
    expiry: "HSD: 1/10/2023",
  },
];

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

export default function Promotions() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const { messageApi } = useHandleMessage();
  const swiperRef = useRef<SwiperRef | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    messageApi.success({
      title: "Sao chép thành công",
      description: "Mã promotion đã được sao chép vào bộ nhớ tạm",
    });
  };

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
    <div className="grid grid-cols-1 gap-4 mb-8">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={10}
        slidesPerView={"auto"}
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
        className="w-full"
      >
        {promotions.map((promotion) => {
          return (
            <SwiperSlide key={promotion.code} className="p-2 !w-fit !mr-2">
              <div
                key={promotion.code}
                className="border rounded-lg p-4 flex flex-col justify-between border-lime-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold">{promotion.code}</div>
                    <div className="text-sm text-muted-foreground">
                      {promotion.description}
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Chi tiết promotion</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {promotion.expiry}
                  </span>
                  <Button
                    variant="default"
                    className="bg-lime-600 "
                    size="sm"
                    onClick={() => copyToClipboard(promotion.code)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Sao chép
                  </Button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
