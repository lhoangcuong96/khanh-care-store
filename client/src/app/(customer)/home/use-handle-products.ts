import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductInListType } from "@/validation-schema/product";
import { accountApiRequest } from "@/api-request/account";
import {
  CategoryWithProductsType,
  GetLandingDataType,
} from "@/validation-schema/landing";

export default function useHandleProducts(landingPageData: GetLandingDataType) {
  const [bestSellerProducts, setBestSellerProducts] = useState<
    ProductInListType[]
  >(landingPageData?.bestSellerProducts || []);
  const [featureProducts, setFeatureProducts] = useState<ProductInListType[]>(
    landingPageData?.bestSellerProducts || []
  );
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<
    CategoryWithProductsType[]
  >(landingPageData?.categoriesWithProducts || []);
  const [promotionProducts, setPromotionProducts] = useState<
    ProductInListType[]
  >(landingPageData?.promotionalProducts || []);
  const { toast } = useToast();
  const router = useRouter();

  const handleSetFavorite = (id: string, isFavorite: boolean) => {
    console.log("handleSetFavorite", id, isFavorite);
    setBestSellerProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, isFavorite } : product
      )
    );
    setFeatureProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, isFavorite } : product
      )
    );
    setCategoriesWithProducts((prev) =>
      prev.map((category) =>
        category.products.some((product) => product.id === id)
          ? {
              ...category,
              products: category.products.map((product) =>
                product.id === id ? { ...product, isFavorite } : product
              ),
            }
          : category
      )
    );
    setPromotionProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, isFavorite } : product
      )
    );
  };

  const handleAddToFavorite = async (id: string) => {
    try {
      await accountApiRequest.addToFavorite(id);
      console.log("handleAddToFavorite", id);
      handleSetFavorite(id, true);
      toast({
        title: "Thêm vào yêu thích thành công",
        duration: 3000,
        variant: "success",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Thêm vào yêu thích thất bại",
        variant: "destructive",
        duration: 3000,
      });
      console.log(error);
    }
  };

  const handleRemoveFromFavorite = async (id: string) => {
    try {
      await accountApiRequest.removeFromFavorite(id);
      handleSetFavorite(id, false);
      toast({
        title: "Xóa khỏi yêu thích thành công",
        duration: 3000,
        variant: "success",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleAddToFavorite,
    handleRemoveFromFavorite,
    bestSellerProducts,
    featureProducts,
    categoriesWithProducts,
    promotionProducts,
  };
}
