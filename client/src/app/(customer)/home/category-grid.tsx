"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  {
    name: "Thiết bị nâng hạ",
    href: "/thiet-bi-nang-ha",
    image: "/categories/thiet-bi-nang-ha.png",
  },
  {
    name: "Chăm Sóc Xe",
    href: "/cham-soc-xe",
    image: "/categories/cham-soc-xe.png",
  },
  {
    name: "Thiết bị làm lốp",
    href: "/thiet-bi-lam-lop",
    image: "/categories/thiet-bi-lam-lop.png",
  },
  {
    name: "Máy rửa xe ANNOVI",
    href: "/may-rua-xe/annovi",
    image: "/categories/may-rua-xe-annovi.png",
  },
  {
    name: "Kiểm tra góc bánh xe",
    href: "/kiem-tra-goc-banh-xe",
    image: "/categories/kiem-tra-goc-banh-xe.png",
  },
  {
    name: "Đèn led Detailing",
    href: "/den-led-detailing",
    image: "/categories/den-led-detailing.png",
  },
  {
    name: "Bình bọt tuyết",
    href: "/binh-bot-tuyet",
    image: "/categories/binh-bot-tuyet.png",
  },
  {
    name: "Nước rửa xe",
    href: "/nuoc-rua-xe",
    image: "/categories/nuoc-rua-xe.png",
  },
  {
    name: "Cầu nâng 1 trụ",
    href: "/cau-nang-1-tru",
    image: "/categories/cau-nang-1-tru.png",
  },
  {
    name: "Tủ dụng đồ nghề",
    href: "/tu-dung-do-nghe",
    image: "/categories/tu-dung-do-nghe.png",
  },
  {
    name: "Thiết bị Garage",
    href: "/thiet-bi-garage",
    image: "/categories/thiet-bi-garage.png",
  },
  {
    name: "Nước rửa xe không chạm",
    href: "/nuoc-rua-xe-khong-cham",
    image: "/categories/nuoc-rua-xe-khong-cham.png",
  },
];

export default function CategoryGrid() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [itemWidth, setItemWidth] = useState(0);
  const [visibleItems, setVisibleItems] = useState(6);

  // Calculate item width and visible items based on screen size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let newVisibleItems = 6; // default for desktop

        if (window.innerWidth < 640) {
          newVisibleItems = 3; // mobile
        } else if (window.innerWidth < 1024) {
          newVisibleItems = 4; // tablet
        }

        const newItemWidth = containerWidth / newVisibleItems;
        setItemWidth(newItemWidth);
        setVisibleItems(newVisibleItems);

        // Reset scroll position when screen size changes
        setScrollPosition(0);
        if (containerRef.current) {
          containerRef.current.scrollLeft = 0;
        }

        // Update arrow visibility
        updateArrowVisibility(0);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const updateArrowVisibility = (newPosition: number) => {
    setShowLeftArrow(newPosition > 0);

    if (containerRef.current) {
      const maxScroll =
        containerRef.current.scrollWidth - containerRef.current.clientWidth;
      setShowRightArrow(newPosition < maxScroll - 10); // 10px buffer for rounding errors
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount =
        direction === "left"
          ? -itemWidth * Math.min(visibleItems, 3)
          : itemWidth * Math.min(visibleItems, 3);

      const newPosition = scrollPosition + scrollAmount;

      // Apply smooth scrolling
      containerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });

      // Update state after scrolling completes
      setTimeout(() => {
        if (containerRef.current) {
          const actualPosition = containerRef.current.scrollLeft;
          setScrollPosition(actualPosition);
          updateArrowVisibility(actualPosition);
        }
      }, 300);
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const position = containerRef.current.scrollLeft;
      setScrollPosition(position);
      updateArrowVisibility(position);
    }
  };

  console.log(showRightArrow);

  return (
    <div className="relative">
      {/* Left arrow */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-md border-gray-200",
          !showLeftArrow && "hidden"
        )}
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Scroll left</span>
      </Button>

      {/* Category grid container */}
      <div
        className="overflow-x-hidden relative w-full"
        ref={containerRef}
        onScroll={handleScroll}
      >
        <div
          className="flex transition-transform duration-300 py-4"
          style={{ width: `${categories.length * itemWidth}px` }}
        >
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group flex flex-col items-center px-2"
              style={{ width: `${itemWidth}px` }}
            >
              <div className="relative w-full aspect-square mb-2 overflow-hidden border rounded-lg">
                <Image
                  src={
                    category.image || "/placeholder.svg?height=150&width=150"
                  }
                  alt={category.name}
                  fill
                  className="object-contain p-2 transition-transform group-hover:scale-105"
                />
              </div>
              <span className="text-xs md:text-sm text-center font-medium group-hover:text-primary line-clamp-2">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Right arrow */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-md border-gray-200",
          !showRightArrow && "hidden"
        )}
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Scroll right</span>
      </Button>
    </div>
  );
}
