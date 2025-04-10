"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";

export default function SaleInfo() {
  const form = useFormContext();
  return (
    <div className="rounded-lg border bg-white p-6 flex flex-col gap-6">
      <h2 className="mb-4 text-lg font-medium">Thông tin bán hàng</h2>

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Giá bán(đ) <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder="Nhập giá bán"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  console.log(e.target.value);
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  field.onChange(+value);
                }}
                value={field.value ? field.value.toLocaleString() : ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="stock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Số lượng <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder="Nhập số lượng"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  console.log(e.target.value);
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  field.onChange(+value);
                }}
                value={field.value ? field.value.toLocaleString() : ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="isFeatured"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center gap-3">
            <FormLabel>
              Sản phẩm nổi bật <span className="text-destructive"></span>
            </FormLabel>
            <FormControl>
              <Checkbox
                {...field}
                className="!m-0"
                onCheckedChange={(checked: CheckedState) => {
                  field.onChange(checked);
                }}
                checked={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="isBestSeller"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center gap-3">
            <FormLabel>
              Sản phẩm bán chạy <span className="text-destructive"></span>
            </FormLabel>
            <FormControl>
              <Checkbox
                {...field}
                className="!m-0"
                onCheckedChange={(checked: CheckedState) => {
                  field.onChange(checked);
                }}
                checked={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
