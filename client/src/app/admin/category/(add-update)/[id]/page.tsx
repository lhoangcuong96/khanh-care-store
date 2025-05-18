import { adminCategoryRequestApis } from "@/api-request/admin/category";
import CategoryForm from "../category-form";

export default async function UpdateCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  let errorMessage = "";
  let category;
  if (!id) {
    errorMessage = "Không tìm thấy danh mục";
  }
  try {
    const resp = await adminCategoryRequestApis.getCategoryDetail(id);
    if (resp.status !== 200 || !resp.payload?.data) {
      errorMessage = "Không tìm thấy danh mục";
    }
    category = resp.payload?.data;
  } catch (error) {
    errorMessage = (error as Error).message;
  }

  return (
    <div className="container p-8 w-full h-full ">
      {errorMessage ? (
        <div className="w-full h-full flex items-center justify-center">
          <div>{errorMessage}</div>
        </div>
      ) : (
        <CategoryForm category={category} />
      )}
    </div>
  );
}
