import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RecommendedProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
}

const recommendedProducts: RecommendedProduct[] = [
  {
    id: "1",
    name: "Kim chi cải thảo cắt lát Bibigo Ông Kim's...",
    image: "/placeholder.svg?height=100&width=100",
    price: 12000,
    originalPrice: 15000,
  },
  {
    id: "2",
    name: "Cháo khoai môn Mikiri hũ 180g",
    image: "/placeholder.svg?height=100&width=100",
    price: 16700,
    originalPrice: 21000,
  },
];

export function Recommendations() {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Có thể bạn thích
          <span className="text-lime-600">🍃</span>
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {recommendedProducts.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="flex gap-4">
              <Image
                src={product.image}
                alt={product.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium line-clamp-2">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-lime-600">
                    {product.price.toLocaleString()}₫
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm line-through text-muted-foreground">
                      {product.originalPrice.toLocaleString()}₫
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
