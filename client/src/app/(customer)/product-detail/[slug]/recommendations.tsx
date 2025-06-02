"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import productRequestApi from "@/api-request/product";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function Recommendations({ slug }: { slug: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  const { data: res, isLoading } = useQuery({
    queryKey: ["recommendations", slug],
    queryFn: async () => {
      const resp = await productRequestApi.getRelatedProducts(slug, {
        page: currentPage,
        limit: productsPerPage,
      });
      return resp.payload;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, res?.totalPages || 0));
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Có thể bạn thích
          <span className="text-slate-600">🍃</span>
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleNext}
            disabled={currentPage === (res?.totalPages || 0)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-4">
          {res?.data?.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex gap-4">
                <Image
                  src={product.image.thumbnail}
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
                    <span className="text-lg font-bold text-slatee-600">
                      {product.price.toLocaleString()}₫
                    </span>
                    {product.isPromotion && product.promotionPercent && (
                      <span className="text-sm line-through text-muted-foreground">
                        {(
                          product.price * product.promotionPercent
                        ).toLocaleString()}
                        ₫
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
