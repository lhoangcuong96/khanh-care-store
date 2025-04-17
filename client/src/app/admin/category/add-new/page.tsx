"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Trash, Plus, ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useHandleStore from "@/hooks/use-handle-store";
import { adminCategoryRequestApis } from "@/api-request/admin/category";
import { FilterType, AttributeType } from "@/validation-schema/category";
import CategoryDropdown from "../../product/(add-update-product)/category-dropdown";

// Define the schema for attributes
const attributeSchema = z.object({
  name: z.string().min(1, "Tên thuộc tính không được để trống"),
  code: z
    .string()
    .min(1, "Mã thuộc tính không được để trống")
    .regex(
      /^[a-z0-9-_]+$/,
      "Mã thuộc tính chỉ được chứa chữ cái thường, số, gạch ngang và gạch dưới"
    ),
  type: z
    .enum(Object.values(AttributeType) as [AttributeType, ...AttributeType[]])
    .default(AttributeType.STRING),
  unit: z.string().optional(),
  options: z.string().optional(),
  filterable: z.boolean().default(true),
  required: z.boolean().default(false),
  filterType: z
    .enum(Object.values(FilterType) as [FilterType, ...FilterType[]])
    .default(FilterType.CHECKBOX),
  displayOrder: z.number().default(0),
});

// Define the main form schema
const formSchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống"),
  slug: z
    .string()
    .min(1, "Slug không được để trống")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug chỉ được chứa chữ cái thường, số và gạch ngang"
    ),
  description: z.string().optional(),
  parentId: z.string().optional(),
  image: z.string({
    required_error: "Hình ảnh không được để trống",
  }),
  attributes: z.array(attributeSchema),
});

type FormValues = z.infer<typeof formSchema>;

// Sample parent categories for the dropdown
const parentCategories = [
  { id: "1", name: "Thiết bị garage" },
  { id: "2", name: "Máy rửa xe" },
  { id: "3", name: "Máy nén khí" },
  { id: "4", name: "Thiết bị nâng hạ" },
  { id: "5", name: "Bình bọt tuyết" },
];

// Attribute type options
const attributeTypeOptions = [
  { value: AttributeType.STRING, label: "Kí tự" },
  { value: AttributeType.NUMBER, label: "Số" },
  { value: AttributeType.BOOLEAN, label: "Boolean" },
  { value: AttributeType.DATE, label: "Ngày tháng" },
  { value: AttributeType.ENUM, label: "Danh sách" },
  { value: AttributeType.RANGE, label: "Khoảng" },
];

// Filter type options
const filterTypes = [
  { value: FilterType.CHECKBOX, label: "Checkbox" },
  { value: FilterType.RADIO, label: "Radio" },
  { value: FilterType.SLIDER, label: "Slider" },
  { value: FilterType.RANGE, label: "Range" },
  { value: FilterType.COLOR_PICKER, label: "Color Picker" },
  { value: FilterType.DROPDOWN, label: "Dropdown" },
];

export default function AddCategoryPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { uploadFile } = useHandleStore();
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentId: "",
      image: "",
      attributes: [],
    },
    mode: "onChange",
  });

  // Set up field array for attributes
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/đ/g, "d")
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
      .replace(/[èéẹẻẽêềếệểễ]/g, "e")
      .replace(/[ìíịỉĩ]/g, "i")
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
      .replace(/[ùúụủũưừứựửữ]/g, "u")
      .replace(/[ỳýỵỷỹ]/g, "y")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to your server or cloud storage
      // For this example, we'll just create a local URL
      setImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      form.setValue("image", file.name); // In real app, this would be the uploaded image URL
    }
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Process attributes - convert options string to array for ENUM type
      const processedData = {
        ...data,
        attributes: data.attributes.map((attr) => {
          return { ...attr, options: [] };
        }),
      };

      // In a real application, you would send this data to your API
      console.log("Form data:", processedData);

      // Upload image
      const imageUrl = await uploadFile(image!);
      if (imageUrl) {
        processedData.image = imageUrl;
      } else {
        await toast({
          title: "Lỗi",
          description: "Đã xảy ra lỗi khi tải lên hình ảnh",
          variant: "destructive",
        });
        return;
      }
      await adminCategoryRequestApis.createCategory(processedData);
      await toast({
        title: "Thành công",
        description: `Đã tạo danh mục "${data.name}" thành công`,
        variant: "success",
        duration: 1000,
      });

      // Redirect to categories list
      // router.push("/admin/categories");
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi tạo danh mục",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a new attribute
  const addAttribute = () => {
    append({
      name: "",
      code: "",
      type: AttributeType.STRING,
      unit: "",
      options: "",
      filterable: true,
      required: false,
      filterType: FilterType.CHECKBOX,
      displayOrder: fields.length,
    });
  };

  return (
    <div className="container p-8">
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Thêm danh mục mới</h1>
            <p className="text-muted-foreground mt-2">
              Tạo danh mục sản phẩm mới với các thuộc tính tùy chỉnh
            </p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-[300px] grid-cols-2">
                <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                <TabsTrigger value="attributes">Thuộc tính</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin danh mục</CardTitle>
                    <CardDescription>
                      Nhập thông tin cơ bản về danh mục sản phẩm
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên danh mục</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ví dụ: Máy rửa xe"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                // Auto-generate slug if slug is empty
                                if (!form.getValues("slug")) {
                                  form.setValue(
                                    "slug",
                                    generateSlug(e.target.value)
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="vi-du-may-rua-xe" {...field} />
                          </FormControl>
                          <FormDescription>
                            Slug sẽ được sử dụng trong URL. Chỉ chứa chữ cái
                            thường, số và dấu gạch ngang.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Nhập mô tả về danh mục sản phẩm"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parentId"
                      render={({ field }) => (
                        <FormItem className="w-full flex flex-col gap-2">
                          <FormLabel>Danh mục cha (nếu có)</FormLabel>
                          <CategoryDropdown
                            onSelect={(category) => {
                              field.onChange(category.id);
                            }}
                            value={field.value}
                            placeholder="Chọn danh mục cha"
                          ></CategoryDropdown>
                          <FormDescription>
                            Nếu đây là danh mục con, hãy chọn danh mục cha cho
                            nó.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hình ảnh danh mục</FormLabel>
                          <div className="flex items-center gap-4">
                            <FormControl>
                              <Input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="category-image"
                                onChange={handleImageUpload}
                              />
                            </FormControl>
                            <div className="flex items-center gap-4">
                              {imagePreview && (
                                <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={imagePreview || "/placeholder.svg"}
                                    alt="Category preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <label
                                htmlFor="category-image"
                                className="flex items-center justify-center px-4 py-2 border border-dashed rounded-md cursor-pointer hover:bg-muted"
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                Tải lên hình ảnh
                              </label>
                            </div>
                          </div>
                          <FormDescription>
                            Tải lên hình ảnh đại diện cho danh mục. Kích thước
                            khuyến nghị: 200x200px.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Attributes Tab */}
              <TabsContent value="attributes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thuộc tính danh mục</CardTitle>
                    <CardDescription>
                      Thêm các thuộc tính cho danh mục này. Các thuộc tính sẽ
                      được sử dụng để lọc và hiển thị sản phẩm.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {fields.length === 0 ? (
                      <div className="text-center py-8 border border-dashed rounded-md">
                        <p className="text-muted-foreground mb-4">
                          Chưa có thuộc tính nào được thêm
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addAttribute}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Thêm thuộc tính
                        </Button>
                      </div>
                    ) : (
                      <>
                        {fields.map((field, index) => (
                          <div
                            key={field.id}
                            className="border rounded-md p-4 space-y-4"
                          >
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium">
                                Thuộc tính #{index + 1}
                              </h3>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => remove(index)}
                              >
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`attributes.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tên thuộc tính</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Ví dụ: Công suất"
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(e);
                                          // Auto-generate code if code is empty
                                          if (
                                            !form.getValues(
                                              `attributes.${index}.code`
                                            )
                                          ) {
                                            form.setValue(
                                              `attributes.${index}.code`,
                                              generateSlug(e.target.value)
                                            );
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`attributes.${index}.code`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Mã thuộc tính</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Ví dụ: cong-suat"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Mã dùng để xác định thuộc tính trong hệ
                                      thống
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`attributes.${index}.type`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Loại thuộc tính</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Chọn loại thuộc tính" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {attributeTypeOptions.map((type) => (
                                          <SelectItem
                                            key={type.value}
                                            value={type.value}
                                          >
                                            {type.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {form.watch(`attributes.${index}.type`) ===
                                "NUMBER" && (
                                <FormField
                                  control={form.control}
                                  name={`attributes.${index}.unit`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Đơn vị</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Ví dụ: W, kg, cm"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormDescription>
                                        Đơn vị đo lường cho thuộc tính số
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}

                              {form.watch(`attributes.${index}.type`) ===
                                "ENUM" && (
                                <FormField
                                  control={form.control}
                                  name={`attributes.${index}.options`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Các giá trị</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Ví dụ: Đỏ, Xanh, Vàng"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormDescription>
                                        Nhập các giá trị, phân cách bằng dấu
                                        phẩy
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>

                            <Separator className="my-4" />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <FormField
                                control={form.control}
                                name={`attributes.${index}.filterable`}
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                      <FormLabel>Có thể lọc</FormLabel>
                                      <FormDescription>
                                        Thuộc tính này có thể dùng để lọc sản
                                        phẩm
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`attributes.${index}.required`}
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                      <FormLabel>Bắt buộc</FormLabel>
                                      <FormDescription>
                                        Sản phẩm phải có thuộc tính này
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              {form.watch(`attributes.${index}.filterable`) && (
                                <FormField
                                  control={form.control}
                                  name={`attributes.${index}.filterType`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Loại bộ lọc</FormLabel>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Chọn loại bộ lọc" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {filterTypes.map((type) => (
                                            <SelectItem
                                              key={type.value}
                                              value={type.value}
                                            >
                                              {type.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormDescription>
                                        Cách hiển thị bộ lọc trên trang sản phẩm
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>

                            <FormField
                              control={form.control}
                              name={`attributes.${index}.displayOrder`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Thứ tự hiển thị</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          Number.parseInt(e.target.value) || 0
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Thứ tự hiển thị của thuộc tính trong bộ lọc
                                    (số nhỏ hơn sẽ hiển thị trước)
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={addAttribute}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Thêm thuộc tính khác
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : "Tạo danh mục"}
                {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
