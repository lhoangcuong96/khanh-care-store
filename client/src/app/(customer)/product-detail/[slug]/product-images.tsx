"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function ProductImages({ images }: { images: string[] }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [startIndex, setStartIndex] = useState(0);

  const showNext = () => {
    if (startIndex + 4 < images.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const showPrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Main Image */}
      <div className="relative aspect-square mb-4">
        <Image
          src={images[currentImage]}
          alt="Product Image"
          width={400}
          height={300}
          className="object-contain"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="relative">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 z-10"
            onClick={showPrev}
            disabled={startIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2 mx-10 overflow-hidden">
            {images.slice(startIndex, startIndex + 4).map((image, index) => (
              <button
                key={startIndex + index}
                className={`relative w-24 aspect-square flex-shrink-0 border-2 rounded-sm transition-colors ${
                  currentImage === startIndex + index
                    ? "border-[#669900]"
                    : "border-transparent hover:border-gray-200"
                }`}
                onClick={() => setCurrentImage(startIndex + index)}
              >
                <Image
                  src={image}
                  alt="Product Image"
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 z-10"
            onClick={showNext}
            disabled={startIndex + 4 >= images.length}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
