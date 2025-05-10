"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GetCategoryAttributesDataType as CategoryAttribute } from "@/validation-schema/admin/category";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import AttributeInput from "./attribute-input";

export default function VariantInfo({
  isLoading,
  error,
  categoryAttributes,
  selectedCategory,
}: {
  isLoading: boolean;
  error: any;
  categoryAttributes: CategoryAttribute[];
  selectedCategory: string | null;
}) {
  const {
    control,
    formState: { errors },
    watch,
    getValues,
  } = useFormContext();

  const {
    fields: records,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const variants = watch("variants");
  useEffect(() => {
    console.log(variants);
  }, [variants]);

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Biến thể sản phẩm</CardTitle>
        {selectedCategory && (
          <Button
            type="button"
            onClick={() =>
              append({
                name: "",
                sku: "",
                price: 0,
                stock: 0,
                attributes: getValues("attributes") || {},
              })
            }
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm biến thể
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {selectedCategory ? (
          <div className="space-y-4">
            {isLoading && (
              <div className="text-center text-muted-foreground py-4">
                Đang tải thuộc tính sản phẩm...
              </div>
            )}
            {!isLoading && error && (
              <div className="text-center text-red-500 py-4">
                Không thể tải thuộc tính sản phẩm. Vui lòng thử lại sau.
              </div>
            )}
            {!isLoading && !error && (
              <>
                {records.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    Chưa có biến thể nào. Nhấn &quot;Thêm biến thể&quot; để bắt
                    đầu.
                  </div>
                )}

                {records.map((record, index) => (
                  <div key={record.id} className="border p-4 rounded-md mb-4">
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
                        <FormField
                          control={control}
                          name={`variants.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <Label htmlFor={`variants.${index}.name`}>
                                  Tên biến thể
                                  <span className="text-red-500 ml-1">*</span>
                                </Label>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  id={`variants.${index}.name`}
                                  placeholder="VD: Dung dịch rửa xe 500ml"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <FormField
                          control={control}
                          name={`variants.${index}.sku`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <Label htmlFor={`variants.${index}.sku`}>
                                  Mã SKU
                                  <span className="text-red-500 ml-1">*</span>
                                </Label>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  id={`variants.${index}.sku`}
                                  {...field}
                                  placeholder="VD: WASH-500ML"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <FormField
                          control={control}
                          name={`variants.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <Label htmlFor={`variants.${index}.price`}>
                                  Giá
                                  <span className="text-red-500 ml-1">*</span>
                                </Label>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  id={`variants.${index}.price`}
                                  type="number"
                                  min={0}
                                  step={0.01}
                                  placeholder="VD: 100000"
                                  {...field}
                                  onChange={(e) => {
                                    const value = parseFloat(e.target.value);
                                    field.onChange(isNaN(value) ? 0 : value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <FormField
                          control={control}
                          name={`variants.${index}.stock`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <Label htmlFor={`variants.${index}.stock`}>
                                  Số lượng
                                  <span className="text-red-500 ml-1">*</span>
                                </Label>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  id={`variants.${index}.stock`}
                                  type="number"
                                  min={0}
                                  step={1}
                                  {...field}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value, 10);
                                    field.onChange(isNaN(value) ? 0 : value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {categoryAttributes!.map((categoryAttribute) => (
                        <AttributeInput
                          key={categoryAttribute.attribute.id}
                          categoryAttribute={categoryAttribute}
                          control={control}
                          errors={errors}
                          name={`variants.${index}.attributes.${categoryAttribute.attribute.id}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            Vui lòng chọn danh mục sản phẩm để xem thuộc tính.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
