/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { GetCategoryAttributesDataType as CategoryAttribute } from "@/validation-schema/admin/category";
import { AttributeSchemaType as Attribute } from "@/validation-schema/category";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

const AttributeInput = ({
  categoryAttribute,
  control,
  errors,
  name,
}: {
  categoryAttribute: CategoryAttribute;
  control: any;
  errors: any;
  name?: string;
}) => {
  const attribute = categoryAttribute.attribute as Attribute;
  const inputName = name || `attributes.${attribute.id}`;
  switch (attribute.type) {
    case "STRING":
      return (
        <FormField
          key={attribute.id}
          control={control}
          name={inputName}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                {categoryAttribute.attribute.name}
                {categoryAttribute.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
                <span className="ml-auto text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                  {attribute.type}
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder={`Nhập ${categoryAttribute.attribute.name.toLowerCase()}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "NUMBER":
      return (
        <FormField
          key={categoryAttribute.attribute.id}
          control={control}
          name={inputName}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                {categoryAttribute.attribute.name}
                {categoryAttribute.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
                <span className="">({attribute.unit})</span>
                <span className="ml-auto text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                  {attribute.type}
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const value =
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value);
                    field.onChange(value);
                  }}
                  value={field.value === undefined ? "" : field.value}
                  placeholder={`Nhập ${categoryAttribute.attribute.name.toLowerCase()}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "BOOLEAN":
      return (
        <FormField
          key={categoryAttribute.attribute.id}
          control={control}
          name={inputName}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="flex items-center">
                  {categoryAttribute.attribute.name}
                  {categoryAttribute.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                  <span className="ml-2 text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                    {attribute.type}
                  </span>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      );
    case "DATE":
      return (
        <FormField
          key={categoryAttribute.attribute.id}
          control={control}
          name={inputName}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center">
                {categoryAttribute.attribute.name}
                {categoryAttribute.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
                <span className="ml-auto text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                  {attribute.type}
                </span>
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value
                        ? format(field.value, "PPP", { locale: vi })
                        : `Chọn ${categoryAttribute.attribute.name.toLowerCase()}`}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "ENUM":
      return (
        <FormField
          key={categoryAttribute.attribute.id}
          control={control}
          name={inputName}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                {categoryAttribute.attribute.name}
                {categoryAttribute.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
                <span className="ml-auto text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                  {attribute.type}
                </span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={`Chọn ${categoryAttribute.attribute.name.toLowerCase()}`}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryAttribute.attribute.options?.map((option: any) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      );
      // case "RANGE":
      //   return (
      //     <FormField
      //       control={control}
      //       name={attribute.id}
      //       render={({ field }) => (
      //         <FormItem>
      //           <FormLabel className="flex items-center">
      //             {categoryAttribute.attribute.name}
      //             {categoryAttribute.required && (
      //               <span className="text-red-500 ml-1">*</span>
      //             )}
      //             <span className="ml-auto text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
      //               {attribute.type}
      //             </span>
      //           </FormLabel>
      //           <FormControl>
      //             <div className="space-y-2">
      //               <Slider
      //                 defaultValue={[
      //                   field.value || categoryAttribute.attribute.min || 0,
      //                 ]}
      //                 max={categoryAttribute.attribute.max}
      //                 min={categoryAttribute.attribute.min}
      //                 step={1}
      //                 onValueChange={(values) => field.onChange(values[0])}
      //               />
      //               <div className="flex justify-between text-xs text-muted-foreground">
      //                 <span>
      //                   {categoryAttribute.attribute.min?.toLocaleString("vi-VN")}{" "}
      //                   đ
      //                 </span>
      //                 <span>{field.value?.toLocaleString("vi-VN") || 0} đ</span>
      //                 <span>
      //                   {categoryAttribute.attribute.max?.toLocaleString("vi-VN")}{" "}
      //                   đ
      //                 </span>
      //               </div>
      //             </div>
      //           </FormControl>
      //           <FormMessage />
      //         </FormItem>
      //       )}
      //     />
      //   );
      // default:
      return null;
  }
};

export default AttributeInput;
