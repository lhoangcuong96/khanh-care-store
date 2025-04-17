"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

export interface ProductCreationFormValues {
  tags: string[];
  variants: Array<{
    name: string;
    sku: string;
    price: number;
    stock: number;
    attributes: {
      volume: string;
      type: string;
    };
  }>;
  // other fields
}

export default function VariantInfo() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ProductCreationFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Biến thể sản phẩm</CardTitle>
        <Button
          type="button"
          onClick={() =>
            append({
              name: "",
              sku: "",
              price: 0,
              stock: 0,
              attributes: { volume: "", type: "" },
            })
          }
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm biến thể
        </Button>
      </CardHeader>
      <CardContent>
        {fields.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            Chưa có biến thể nào. Nhấn &quot;Thêm biến thể&quot; để bắt đầu.
          </div>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="border p-4 rounded-md mb-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Biến thể #{index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`variants.${index}.name`}>Tên biến thể</Label>
                <Input
                  id={`variants.${index}.name`}
                  {...register(`variants.${index}.name`)}
                  placeholder="VD: Dung dịch rửa xe 500ml"
                />
                {errors.variants?.[index]?.name && (
                  <p className="text-sm text-destructive">
                    {errors.variants[index]?.name?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`variants.${index}.sku`}>Mã SKU</Label>
                <Input
                  id={`variants.${index}.sku`}
                  {...register(`variants.${index}.sku`)}
                  placeholder="VD: WASH-500ML"
                />
                {errors.variants?.[index]?.sku && (
                  <p className="text-sm text-destructive">
                    {errors.variants[index]?.sku?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`variants.${index}.price`}>Giá</Label>
                <Input
                  id={`variants.${index}.price`}
                  type="number"
                  {...register(`variants.${index}.price`, {
                    valueAsNumber: true,
                  })}
                />
                {errors.variants?.[index]?.price && (
                  <p className="text-sm text-destructive">
                    {errors.variants[index]?.price?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`variants.${index}.stock`}>Số lượng</Label>
                <Input
                  id={`variants.${index}.stock`}
                  type="number"
                  {...register(`variants.${index}.stock`, {
                    valueAsNumber: true,
                  })}
                />
                {errors.variants?.[index]?.stock && (
                  <p className="text-sm text-destructive">
                    {errors.variants[index]?.stock?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
