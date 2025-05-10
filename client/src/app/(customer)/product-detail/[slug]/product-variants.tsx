"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductDetailType } from "@/validation-schema/product";
import { useState } from "react";

interface ProductVariant {
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

interface ProductVariantsProps {
  product: ProductDetailType;
  onVariantSelect: (variant: ProductVariant) => void;
}

export function ProductVariants({
  product,
  onVariantSelect,
}: ProductVariantsProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const variants = product.variants || [];

  // Get unique attribute names from all variants
  const attributeNames = Array.from(
    new Set(
      variants.flatMap((variant) => Object.keys(variant.attributes || {}))
    )
  );

  // Get available options for each attribute based on selected attributes
  const getAvailableOptions = (attributeName: string) => {
    const options = new Set<string>();
    variants.forEach((variant) => {
      const variantAttributes = variant.attributes || {};
      // Only include options from variants that match other selected attributes
      const matchesOtherSelections = Object.entries(selectedAttributes).every(
        ([key, value]) =>
          key === attributeName || variantAttributes[key] === value
      );
      if (matchesOtherSelections && variantAttributes[attributeName]) {
        options.add(variantAttributes[attributeName]);
      }
    });
    return Array.from(options);
  };

  // Find the selected variant based on selected attributes
  const findSelectedVariant = () => {
    return variants.find((variant) =>
      Object.entries(selectedAttributes).every(
        ([key, value]) => variant.attributes?.[key] === value
      )
    );
  };

  const handleAttributeChange = (attributeName: string, value: string) => {
    const newSelectedAttributes = {
      ...selectedAttributes,
      [attributeName]: value,
    };
    setSelectedAttributes(newSelectedAttributes);

    // Find and notify about the selected variant
    const selectedVariant = variants.find((variant) =>
      Object.entries(newSelectedAttributes).every(
        ([key, value]) => variant.attributes?.[key] === value
      )
    );

    if (selectedVariant) {
      onVariantSelect(selectedVariant);
    }
  };

  const selectedVariant = findSelectedVariant();

  return (
    <div className="space-y-4">
      {attributeNames.map((attributeName) => (
        <div key={attributeName} className="space-y-2">
          <label className="text-sm font-medium">{attributeName}</label>
          <Select
            value={selectedAttributes[attributeName] || ""}
            onValueChange={(value) =>
              handleAttributeChange(attributeName, value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={`Chọn ${attributeName}`} />
            </SelectTrigger>
            <SelectContent>
              {getAvailableOptions(attributeName).map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      {selectedVariant && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{selectedVariant.name}</p>
              <p className="text-sm text-muted-foreground">
                SKU: {selectedVariant.sku}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">
                {selectedVariant.price.toLocaleString()}đ
              </p>
              <p className="text-sm text-muted-foreground">
                Còn {selectedVariant.stock} sản phẩm
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
