import { categoryAdminRequestApis } from "@/api-request/admin/category";
import { useAppContext } from "@/provider/app-provider";
import { useEffect, useState } from "react";
import { useHandleMessage } from "../use-handle-message";

const useCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { categories, setCategories } = useAppContext();
  const { messageApi } = useHandleMessage();

  const getListCategory = async () => {
    try {
      setIsLoading(true);
      const res = await categoryAdminRequestApis.getCategoryList();
      if (!res.payload?.data)
        throw new Error("Không thể lấy danh sách danh mục");
      setCategories(res.payload.data);
    } catch (error) {
      messageApi.error({
        error: error as Error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (categories.length === 0) {
      getListCategory();
    }
  }, [categories]);

  return {
    isLoading,
    categories,
  };
};

export default useCategory;
