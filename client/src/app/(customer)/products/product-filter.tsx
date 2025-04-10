"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ProductListQueryType } from "@/validation-schema/product";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface PriceRange {
  label: string;
  value: string;
}

const priceRanges: PriceRange[] = [
  { label: "Dưới 10.000đ", value: "0-10000" },
  { label: "Từ 10.000đ - 50.000đ", value: "10000-50000" },
  { label: "Từ 50.000đ - 100.000đ", value: "50000-100000" },
  { label: "Từ 100.000đ - 200.000đ", value: "100000-200000" },
  { label: "Từ 200.000đ - 300.000đ", value: "200000-300000" },
  { label: "Từ 300.000đ - 500.000đ", value: "300000-500000" },
  { label: "Từ 500.000đ - 1 triệu", value: "500000-1000000" },
];
const weights = [
  {
    label: "300g",
    value: "300",
  },
  {
    label: "500g",
    value: "500",
  },
  {
    label: "1kg",
    value: "1000",
  },
];

const productTags = [
  { label: "Sản phẩm khuyến mãi", value: "isPromotion" },
  {
    label: "Sản phẩm nổi bật",
    value: "isFeatured",
  },
  {
    label: "Sản phẩm bán chạy",
    value: "isBestSeller",
  },
];

export default function ProductFilter({
  params,
}: {
  params?: ProductListQueryType;
}) {
  const router = useRouter();

  const handlePriceCheckboxChange = useCallback(
    (value: string) => {
      const searchParams = new URLSearchParams(window.location.search);
      if (!searchParams) return;

      let currentValues = searchParams.getAll("price");
      currentValues = currentValues.filter((v) => !!v);

      if (currentValues.includes(value)) {
        currentValues = currentValues.filter((v) => v !== value);
      } else {
        currentValues.push(value);
      }

      searchParams.delete("price");
      currentValues.forEach((val) => searchParams.append("price", val));

      router.push(`/products?${searchParams.toString()}`);
    },
    [router]
  );

  const handleWeightCheckboxChange = useCallback(
    (value: string) => {
      const searchParams = new URLSearchParams(window.location.search);
      if (!searchParams) return;

      let currentValues = searchParams.getAll("weight");
      currentValues = currentValues.filter((v) => !!v);

      if (currentValues.includes(value)) {
        currentValues = currentValues.filter((v) => v !== value);
      } else {
        currentValues.push(value);
      }

      searchParams.delete("weight");
      currentValues.forEach((val) => searchParams.append("weight", val));

      router.push(`/products?${searchParams.toString()}`);
    },
    [router]
  );

  const handleProductTagCheckboxChange = useCallback(
    (value: string) => {
      const searchParams = new URLSearchParams(window.location.search);
      if (!searchParams) return;
      searchParams.set(value, searchParams.get(value) === "true" ? "" : "true");
      router.push(`/products?${searchParams.toString()}`);
    },
    [router]
  );
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 text-lime-600 p-4 border-dashed border-2 border-lime-600">
        Bộ lọc sản phẩm
      </h2>
      <div className="bg-lime-100 px-3 py-2 rounded-md">
        <div className="text-lg font-semibold mb-4 rounded flex flex-row gap-2 items-center justify-between">
          <h3 className="text-lime-600">Đánh dấu sản phẩm</h3>
        </div>
        {productTags.map((tag) => {
          let isChecked = false;
          if (params?.[tag.value as keyof ProductListQueryType]) {
            isChecked =
              params?.[tag.value as keyof ProductListQueryType] === "true";
          }
          return (
            <div key={tag.value} className="flex items-center space-x-2 mb-2">
              <Checkbox
                id={tag.value}
                checked={isChecked}
                onCheckedChange={() => {
                  handleProductTagCheckboxChange(tag.value);
                }}
              />
              <label htmlFor={tag.value} className="text-sm">
                {tag.label}
              </label>
            </div>
          );
        })}
      </div>
      <div className="bg-lime-100 px-3 py-2 rounded-md">
        <div className="text-lg font-semibold mb-4 rounded flex flex-row gap-2 items-center justify-between">
          <h3 className="text-lime-600">Chọn mức giá</h3>
        </div>

        {priceRanges.map((range) => {
          let isChecked = false;
          if (params?.price) {
            isChecked =
              typeof params?.price === "string"
                ? params?.price === range.value
                : params?.price.includes(range.value);
          }

          return (
            <div key={range.value} className="flex items-center space-x-2">
              <div
                key={range.value}
                className="flex items-center space-x-2 mb-2"
              >
                <Checkbox
                  id={range.value}
                  value={range.value}
                  checked={isChecked}
                  onCheckedChange={() => {
                    handlePriceCheckboxChange(range.value);
                  }}
                />
                <label htmlFor={range.value} className="text-sm">
                  {range.label}
                </label>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-lime-100 px-3 py-2 rounded-md">
        <div className="text-lg font-semibold mb-4 rounded flex flex-row gap-2 items-center justify-between">
          <h3 className="text-lime-600">Trọng lượng</h3>
        </div>
        {weights.map((weight) => {
          let isChecked = false;
          if (params?.weight) {
            isChecked =
              typeof params?.weight === "string"
                ? params?.weight === weight.value
                : params?.weight.includes(weight.value);
          }
          return (
            <div
              key={weight.value}
              className="flex items-center space-x-2 mb-2"
            >
              <Checkbox
                id={weight.value}
                checked={isChecked}
                onCheckedChange={() => {
                  handleWeightCheckboxChange(weight.value);
                }}
              />
              <label htmlFor={weight.value} className="text-sm">
                {weight.label}
              </label>
            </div>
          );
        })}
      </div>
    </>
  );
}
