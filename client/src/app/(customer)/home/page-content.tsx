"use client";

import Spinner from "@/components/ui/spinner";
import { GetLandingDataType } from "@/validation-schema/landing";
import { Suspense } from "react";
import { BestSellingProducts } from "./best-selling-products";
import { CategoryWithProducts } from "./category-with-products";
import { FeaturedCategories } from "./featured-categories";
import { FeaturedProducts } from "./featured-products";
import NewsSection from "./news-section";
import { OurSpecialServices } from "./our-special-services";
import useHandleProducts from "./use-handle-products";

export default function PageContent({
  landingPageData,
  getProductError,
}: {
  landingPageData: GetLandingDataType;
  getProductError: string;
}) {
  const {
    bestSellerProducts,
    featureProducts,
    categoriesWithProducts,
    handleAddToFavorite,
    handleRemoveFromFavorite,
  } = useHandleProducts(landingPageData);
  return (
    <>
      <div className="flex flex-col items-center gap-8 px-5 w-full max-w-screen-xl">
        <Suspense fallback={<Spinner />}>
          <FeaturedCategories
            categories={bestSellerProducts}
            error={getProductError}
          ></FeaturedCategories>
        </Suspense>
        <Suspense fallback={<Spinner />}>
          <FeaturedProducts
            products={featureProducts}
            handleAddToFavorite={handleAddToFavorite}
            handleRemoveFromFavorite={handleRemoveFromFavorite}
            error={getProductError}
          ></FeaturedProducts>
          <BestSellingProducts
            products={bestSellerProducts}
            handleAddToFavorite={handleAddToFavorite}
            handleRemoveFromFavorite={handleRemoveFromFavorite}
            error={getProductError}
          ></BestSellingProducts>
        </Suspense>
        <Suspense fallback={<Spinner />}>
          {categoriesWithProducts.map((category) => (
            <CategoryWithProducts
              key={category.id}
              category={category}
              error={getProductError}
              products={category.products}
              handleAddToFavorite={handleAddToFavorite}
              handleRemoveFromFavorite={handleRemoveFromFavorite}
            ></CategoryWithProducts>
          ))}
        </Suspense>

        <OurSpecialServices></OurSpecialServices>
        <NewsSection news={landingPageData?.listNews || []} />
      </div>
      {/* News Section with mock data */}
    </>
  );
}
