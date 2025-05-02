/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetCategoryAttributesDataType as CategoryAttribute } from "@/validation-schema/admin/category";
import { useFormContext } from "react-hook-form";
import * as z from "zod";
import AttributeInput from "./attribute-input";

const createAttributesSchema = (categoryAttributes: CategoryAttribute[]) => {
  const schemaMap: Record<string, any> = {};

  categoryAttributes.forEach((categoryAttribute) => {
    let fieldSchema: any;

    switch (categoryAttribute.attribute.type) {
      case "STRING":
        fieldSchema = z.string();
        if (categoryAttribute.required) {
          fieldSchema = fieldSchema.min(1, {
            message: `${categoryAttribute.attribute.name} là bắt buộc`,
          });
        }
        break;
      case "NUMBER":
        fieldSchema = z.number({
          required_error: `${categoryAttribute.attribute.name} là bắt buộc`,
          invalid_type_error: `${categoryAttribute.attribute.name} phải là số`,
        });
        break;
      case "BOOLEAN":
        fieldSchema = z.boolean();
        if (categoryAttribute.required) {
          fieldSchema = fieldSchema.refine((val: any) => val === true, {
            message: `${categoryAttribute.attribute.name} là bắt buộc`,
          });
        }
        break;
      case "DATE":
        fieldSchema = z.date({
          required_error: `${categoryAttribute.attribute.name} là bắt buộc`,
          invalid_type_error: `${categoryAttribute.attribute.name} phải là ngày hợp lệ`,
        });
        break;
      case "ENUM":
        fieldSchema = z.string({
          required_error: `${categoryAttribute.attribute.name} là bắt buộc`,
        });
        if (
          categoryAttribute.attribute.options &&
          categoryAttribute.attribute.options.length > 0
        ) {
          fieldSchema = fieldSchema.refine(
            (val: any) => categoryAttribute.attribute.options!.includes(val),
            {
              message: `${categoryAttribute.attribute.name} phải là một trong các giá trị hợp lệ`,
            }
          );
        }
        break;
      // case "RANGE":
      //   fieldSchema = z.number({
      //     required_error: `${categoryAttribute.attribute.name} là bắt buộc`,
      //     invalid_type_error: `${categoryAttribute.attribute.name} phải là số`,
      //   });
      //   if (categoryAttribute.attribute.min !== undefined) {
      //     fieldSchema = fieldSchema.min(categoryAttribute.attribute.min, {
      //       message: `${categoryAttribute.attribute.name} phải lớn hơn hoặc bằng ${categoryAttribute.attribute.min}`,
      //     });
      //   }
      //   if (categoryAttribute.attribute. !== undefined) {
      //     fieldSchema = fieldSchema.max(categoryAttribute.attribute.max, {
      //       message: `${categoryAttribute.attribute.name} phải nhỏ hơn hoặc bằng ${categoryAttribute.attribute.max}`,
      //     });
      //   }
      //   break;
      default:
        fieldSchema = z.any();
    }

    if (
      !categoryAttribute.required &&
      categoryAttribute.attribute.type !== "BOOLEAN"
    ) {
      fieldSchema = fieldSchema.optional();
    }

    schemaMap[categoryAttribute.attribute.id] = fieldSchema;
  });

  return z.object(schemaMap);
};

export default function ProductAttributes({
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
  const form = useFormContext();

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Thuộc tính sản phẩm</CardTitle>
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
              <div className="space-y-4 mt-4">
                <h3 className="text-sm font-medium">
                  Thuộc tính theo danh mục
                </h3>

                {categoryAttributes!.map((categoryAttribute) => (
                  <AttributeInput
                    key={categoryAttribute.attribute.id}
                    categoryAttribute={categoryAttribute}
                    control={form.control}
                    errors={form.formState.errors}
                  />
                ))}
              </div>
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
