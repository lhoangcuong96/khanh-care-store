"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductModal({
  open,
  onOpenChange,
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const productImages = [
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
  ];

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images Section */}
          <div className="p-6">
            <div className="border rounded-md overflow-hidden mb-4">
              <Image
                src={productImages[selectedImage] || "/placeholder.svg"}
                alt="Product image"
                width={400}
                height={400}
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border rounded-md overflow-hidden flex-shrink-0 ${
                    selectedImage === index ? "border-primary border-2" : ""
                  }`}
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">
              Bưởi da xanh trái 1.7kg trở lên
            </h2>

            <div className="flex flex-col gap-2 mb-4">
              <div className="flex gap-2">
                <span className="text-muted-foreground">Tình trạng:</span>
                <span className="text-[#8BC34A] font-medium">Còn hàng</span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground">Mã sản phẩm:</span>
                <span className="text-[#8BC34A] font-medium">
                  Dạng cập nhật
                </span>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-[#8BC34A] text-3xl font-bold">80.100₫</span>
              <span className="text-muted-foreground line-through ml-2">
                90.000₫
              </span>
            </div>

            <div className="mb-4">
              <h3 className="mb-2">Thông tin sản phẩm đang cập nhật</h3>
            </div>

            <div className="mb-6">
              <div className="mb-2">Số lượng:</div>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  className="h-10 w-10 border-[#8BC34A] text-[#8BC34A] hover:bg-[#8BC34A] hover:text-white"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-16 h-10 flex items-center justify-center border border-input mx-1">
                  {quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  className="h-10 w-10 border-[#8BC34A] text-[#8BC34A] hover:bg-[#8BC34A] hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button className="w-full bg-[#8BC34A] hover:bg-[#7CB342] text-white font-medium py-6">
              THÊM VÀO GIỎ HÀNG
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
