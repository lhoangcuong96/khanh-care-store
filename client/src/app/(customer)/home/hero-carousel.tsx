"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    image: "/images/trang-chu-tahico-1-1.webp",
    title: "DỊCH VỤ SỬA CHỮA & BẢO DƯỠNG",
    phone: "0987 694 999",
    cta: "LIÊN HỆ NGAY",
    ctaLink: "/lien-he",
  },
  {
    id: 2,
    image: "/images/trang-chu-tahico-4-1.webp",
    title: "TAHICO CHUYÊN SETUP",
    phone: "",
    cta: "Liên hệ",
    ctaLink: "/lien-he",
    subItems: [
      {
        text: "Trung tâm chăm sóc xe chuyên nghiệp",
        link: "/dich-vu/cham-soc-xe",
      },
      { text: "Dịch vụ bảo trì & nâng cấp ô tô", link: "/dich-vu/bao-tri" },
      { text: "Cửa Workshop & Trung tâm làm đẹp", link: "/dich-vu/workshop" },
    ],
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative w-full flex-shrink-0">
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              width={900}
              height={600}
              className="w-full h-[200px] md:h-[300px] lg:h-[600px] object-cover"
              priority
            />

            {slide.id === 1 ? (
              <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-10 bg-gradient-to-r from-blue-900/70 to-transparent">
                <h2 className="text-xl md:text-3xl font-bold text-white mb-4">
                  {slide.title}
                </h2>
                <div className="flex items-center gap-2 bg-orange-500 text-white px-3 py-2 rounded-full w-fit mb-4">
                  <Phone className="h-4 w-4" />
                  <span className="font-bold">{slide.phone}</span>
                </div>
                <Link href={slide.ctaLink}>
                  <Button className="bg-blue-800 hover:bg-blue-700 text-white w-fit">
                    {slide.cta}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-10">
                <div className="bg-blue-800/90 rounded-xl p-4 md:p-6 w-full max-w-3xl">
                  <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-4">
                    {slide.title}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mb-4">
                    {slide.subItems?.map((item, index) => (
                      <Link
                        key={index}
                        href={item.link}
                        className="bg-white/10 hover:bg-white/20 text-white text-center p-2 rounded-lg text-sm md:text-base"
                      >
                        {item.text}
                      </Link>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <Link href={slide.ctaLink}>
                      <Button className="bg-orange-500 hover:bg-orange-400 text-white">
                        {slide.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              currentSlide === index ? "bg-orange-500" : "bg-white/50"
            )}
            onClick={() => setCurrentSlide(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
