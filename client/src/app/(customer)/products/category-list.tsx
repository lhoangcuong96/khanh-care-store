import { Link } from "@/components/ui/link";
import { routePath } from "@/constants/routes";
import { CategoryInListType } from "@/validation-schema/category";
import { ProductListQueryType } from "@/validation-schema/product";
import Image from "next/image";

const CategoryList = ({
  categories,
  params,
}: {
  categories: CategoryInListType[];
  params?: ProductListQueryType;
}) => {
  const convertParams = (params?: ProductListQueryType) => {
    if (!params) return {};
    return {
      ...params,
      isBestSeller: params.isBestSeller === "true",
      isFeatured: params.isFeatured === "true",
      isPromotion: params.isPromotion === "true",
    };
  };

  return (
    <div className="bg-slate-100 px-3 py-2 rounded-md">
      <div className="text-lg font-semibold mb-4 rounded flex flex-row gap-2 items-center justify-between">
        <h2 className="text-slate-600">Danh mục sản phẩm</h2>
        <Image
          src="/images/icons/leaf.webp"
          alt="icon"
          width={25}
          height={25}
        ></Image>
      </div>
      <ul className="space-y-3">
        {categories.length === 0 ? (
          <p className="text-red-500">Không có danh mục nào để hiển thị</p>
        ) : (
          <>
            <Link
              href={routePath.customer.products({
                ...convertParams(params),
                category: "",
              })}
              className="block no-underline cursor-pointer"
              scroll={false}
            >
              <li className="text-base hover:text-slate-700">
                Tất cả sản phẩm
              </li>
            </Link>
            {categories.map((category) => {
              const url = routePath.customer.products({
                ...convertParams(params),
                category: category.id,
              });
              const isActive = params?.category === category.id;
              return (
                <Link
                  href={url}
                  key={category.id}
                  className="block no-underline cursor-pointer"
                  scroll={false}
                >
                  <li
                    className={`text-base hover:text-slatee-700 ${
                      isActive ? "text-lg font-semibold" : ""
                    }`}
                  >
                    {category.name}
                  </li>
                </Link>
              );
            })}
          </>
        )}
      </ul>
    </div>
  );
};

export default CategoryList;
