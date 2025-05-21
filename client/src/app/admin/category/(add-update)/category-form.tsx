"use client";

import type React from "react";

import { adminCategoryRequestApis } from "@/api-request/admin/category";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import useHandleStore from "@/hooks/use-handle-store";
import { useToast } from "@/hooks/use-toast";
import { AttributeType, FilterType } from "@/validation-schema/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Save, Trash, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import CategoryDropdown from "../../product/(add-update-product)/category-dropdown";
import Image from "next/image";
// Define the schema for attributes

const attributeSchema = z.object({
  id: z.string().optional(),
  code: z
    .string()
    .min(1, "Mã thuộc tính không được để trống")
    .regex(
      /^[a-z0-9-_]+$/,
      "Mã thuộc tính chỉ được chứa chữ cái thường, số, gạch ngang và gạch dưới"
    ),
  name: z.string().min(1, "Tên thuộc tính không được để trống"),
  description: z.string().optional(),
  options: z.string().optional(),
  type: z
    .enum(Object.values(AttributeType) as [AttributeType, ...AttributeType[]])
    .default(AttributeType.STRING),
  unit: z.string().optional(),
});
const categoryAttributeSchema = z.object({
  id: z.string().optional(),
  attribute: attributeSchema,
  filterable: z.boolean().default(true),
  required: z.boolean().default(false),
  filterType: z
    .enum(Object.values(FilterType) as [FilterType, ...FilterType[]])
    .default(FilterType.CHECKBOX),
  displayOrder: z.number().default(0),
});

// Define the main form schema
const formSchema = z.object({
  id: z.string().optional(),
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
  banner: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isShowOnHomePage: z.boolean().default(false),
  attributes: z.array(categoryAttributeSchema),
});

type FormValues = z.infer<typeof formSchema>;

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

const CategoryForm = ({ category }: { category?: any }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const { uploadFile } = useHandleStore();
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: category?.id || "",
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
      parentId: category?.parentId || "",
      image: category?.image.thumbnail || "",
      banner: category?.image.banner || "",
      isFeatured: category?.isFeatured || false,
      isShowOnHomePage: category?.isShowOnHomePage || false,
      attributes: category?.attributes || [],
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

  // Handle banner upload
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const removeBanner = () => {
    setBanner(null);
    setBannerPreview(null);
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Process attributes - convert options string to array for ENUM type
      const processedData = {
        ...data,
      };
      const uploadPromise = [];
      // Upload image
      if (image) {
        uploadPromise.push(uploadFile(image));
      }
      if (banner) {
        uploadPromise.push(uploadFile(banner));
      }
      const uploadResults = await Promise.all(uploadPromise);
      console.log(uploadResults);
      if (image) {
        processedData.image = uploadResults[0];
        if (banner) {
          processedData.banner = uploadResults[1];
        }
      } else {
        if (banner) {
          processedData.banner = uploadResults[0];
        }
      }

      let message = `Đã tạo danh mục "${data.name}" thành công`;
      if (processedData.id) {
        await adminCategoryRequestApis.updateCategory(processedData.id, {
          ...processedData,
          image: {
            thumbnail: processedData.image,
            banner: processedData.banner,
          },
        });
        message = `Đã cập nhật danh mục "${data.name}" thành công`;
      } else {
        await adminCategoryRequestApis.createCategory({
          ...processedData,
          image: {
            thumbnail: processedData.image,
            banner: processedData.banner,
          },
        });
      }

      await toast({
        title: "Thành công",
        description: message,
        variant: "success",
        duration: 300,
      });

      // Redirect to categories list
      // router.push("/admin/categories");
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi tạo danh mục",
        variant: "destructive",
        duration: 300,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a new attribute
  const addAttribute = () => {
    append({
      attribute: {
        code: "",
        name: "",
        description: "",
        type: AttributeType.STRING,
        options: "",
        unit: "",
      },
      filterable: true,
      required: false,
      filterType: FilterType.CHECKBOX,
      displayOrder: fields.length,
    });
  };

  return (
    <div className="mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {category ? "Chỉnh sửa" : "Tạo mới"} danh mục
            {category?.name && ` ${category.name}`}
          </h1>
          <p className="text-muted-foreground mt-2">
            {category ? "Chỉnh sửa" : "Tạo mới"} danh mục sản phẩm với các thuộc
            tính tùy chỉnh
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
                              form.setValue(
                                "slug",
                                generateSlug(e.target.value)
                              );
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
                          onSelect={(category: any) => {
                            field.onChange(category.id);
                          }}
                          value={field.value}
                          placeholder="Chọn danh mục cha"
                        ></CategoryDropdown>
                        <FormDescription>
                          Nếu đây là danh mục con, hãy chọn danh mục cha cho nó.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={() => (
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
                            {(imagePreview || category?.image.thumbnail) && (
                              <div className="relative w-24 h-24 border rounded-md overflow-hidden group">
                                <Image
                                  src={
                                    imagePreview ||
                                    category?.image.thumbnail ||
                                    "/placeholder.svg"
                                  }
                                  alt="Category preview"
                                  className="w-full h-full object-cover"
                                  width={96}
                                  height={96}
                                />
                                <button
                                  type="button"
                                  className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-500 hover:bg-opacity-100"
                                  onClick={() => {
                                    setImage(null);
                                    setImagePreview(null);
                                    form.setValue("image", "");
                                  }}
                                >
                                  <Trash className="h-4 w-4" />
                                </button>
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
                  {/* Category Banner Upload */}
                  <div className="mt-4">
                    <FormLabel>Ảnh banner danh mục</FormLabel>
                    <div className="flex items-center gap-4 mt-2">
                      {bannerPreview && (
                        <div className="relative w-48 h-24 border rounded-md overflow-hidden group">
                          <Image
                            src={bannerPreview}
                            className="w-full h-full object-cover"
                            width={192}
                            height={72}
                            alt="Banner preview"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-500 hover:bg-opacity-100"
                            onClick={removeBanner}
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="category-banner"
                        onChange={handleBannerUpload}
                      />
                      <label
                        htmlFor="category-banner"
                        className="flex items-center justify-center px-4 py-2 border border-dashed rounded-md cursor-pointer hover:bg-muted"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Tải lên banner
                      </label>
                    </div>
                    <FormDescription>
                      Tải lên một ảnh banner cho danh mục này. Kích thước khuyến
                      nghị: 1200x300px.
                    </FormDescription>
                  </div>
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Danh mục nổi bật</FormLabel>
                          <FormDescription>
                            Danh mục này sẽ được hiển thị ở vị trí nổi bật trên
                            trang chủ
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
                    name="isShowOnHomePage"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Hiển thị trên trang chủ</FormLabel>
                          <FormDescription>
                            Sản phẩm của danh mục này sẽ được hiển thị trên
                            trang chủ
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
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attributes Tab */}
            <TabsContent value="attributes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thuộc tính danh mục</CardTitle>
                  <CardDescription>
                    Thêm các thuộc tính cho danh mục này. Các thuộc tính sẽ được
                    sử dụng để lọc và hiển thị sản phẩm.
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
                              name={`attributes.${index}.attribute.name`}
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
                                            `attributes.${index}.attribute.code`
                                          )
                                        ) {
                                          form.setValue(
                                            `attributes.${index}.attribute.code`,
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
                              name={`attributes.${index}.attribute.code`}
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
                              name={`attributes.${index}.attribute.type`}
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

                            {form.watch(
                              `attributes.${index}.attribute.type`
                            ) === "NUMBER" && (
                              <FormField
                                control={form.control}
                                name={`attributes.${index}.attribute.unit`}
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

                            {form.watch(
                              `attributes.${index}.attribute.type`
                            ) === "ENUM" && (
                              <FormField
                                control={form.control}
                                name={`attributes.${index}.attribute.options`}
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
                                      Nhập các giá trị, phân cách bằng dấu phẩy
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
                                      Thuộc tính này có thể dùng để lọc sản phẩm
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
              {isSubmitting
                ? "Đang lưu..."
                : category?.id
                ? "Cập nhật"
                : "Tạo mới"}
              {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CategoryForm;
