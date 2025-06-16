import { accountApiRequest } from "@/api-request/account";
import { useToast } from "@/hooks/use-toast";
import { ProductInListType } from "@/validation-schema/product";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useHandleProducts(
  initialProducts: ProductInListType[]
) {
  const [products, setProducts] = useState<ProductInListType[]>([]);

  const { toast } = useToast();
  const router = useRouter();

  const handleSetFavorite = (id: string, isFavorite: boolean) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, isFavorite } : product
      )
    );
  };

  const handleAddToFavorite = async (id: string) => {
    try {
      await accountApiRequest.addToFavorite(id);
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

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  return {
    products,
    handleAddToFavorite,
    handleRemoveFromFavorite,
  };
}
