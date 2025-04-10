"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, X } from "lucide-react";

import { categoryRequestApis } from "@/api-request/admin/category";
import { CategorySelector } from "@/components/share/category-selector";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { routePath } from "@/constants/routes";
import { useHandleMessage } from "@/hooks/use-handle-message";
import useHandleStore from "@/hooks/use-handle-store";
import {
  CreateCategorySchema,
  CreateCategoryType,
  MAX_CATEGORY_SAMPLE_IMAGES,
} from "@/validation-schema/category";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function CreateCategoryPage() {
  const [isOpenCategorySelector, setIsOpenCategorySelector] = useState(false);

  const { messageApi } = useHandleMessage();
  const { storeUpload } = useHandleStore();
  const router = useRouter();

  const categorySampleImageRef = useRef<HTMLInputElement>(null);
  const categoryFeaturedImageRef = useRef<HTMLInputElement>(null);
  const attributeInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateCategoryType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      parent: "",
    },
    mode: "onChange",
  });

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const files = e.target.files;
    if (!files) return;
    if (files.length > MAX_CATEGORY_SAMPLE_IMAGES) {
      messageApi.error({
        error: new Error(
          `Chỉ được tải lên tối đa ${MAX_CATEGORY_SAMPLE_IMAGES} hình ảnh`
        ),
      });
      return;
    }
    if (field.name === "image.sample") {
      const prevImages = field.value || [];
      const fileArray = Array.from(files);
      field.onChange([...prevImages, ...fileArray]);
    }

    if (field.name === "image.featured") {
      field.onChange(files[0]);
    }

    e.target.value = "";
  };

  const deleteImage = (index: number, field: any) => {
    const images = field.value || [];
    if (images[index]) {
      const newImages = [...images];
      newImages.splice(index, 1);
      field.onChange(newImages);
    }
  };

  const submit = async (data: CreateCategoryType) => {
    try {
      if (data.image.featured instanceof File) {
        const featuredImageUrl = await storeUpload(data.image.featured);
        data.image.featured = featuredImageUrl;
      }
      if (
        data.image.sample.some((item: File | string) => item instanceof File)
      ) {
        const sampleImageUrls = await Promise.all(
          data.image.sample.map(async (item: File | string) => {
            if (item instanceof File) {
              return await storeUpload(item);
            }
            return item;
          })
        );
        data.image.sample = sampleImageUrls;
      }
      const resp = await categoryRequestApis.createCategory(data);
      messageApi.success({
        title: "Thành công",
        description: resp.payload?.message || "Thêm loại sản phẩm thành công",
        duration: 1000,
      });
      router.push(routePath.admin.category.list);
    } catch (e) {
      console.log(e);
      messageApi.error({ error: e as Error });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <Card className="w-full max-w-4xl bg-white px-20 py-10 rounded-sm">
        <h1 className="text-2xl font-semibold mb-10">Thêm loại sản phẩm</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submit)}
            className="flex flex-col gap-6 "
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem className="grid grid-cols-[120px_auto] w-full gap-x-6">
                    <FormLabel className=" font-semibold text-right mt-2">
                      Tên
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl className="w-full">
                      <Input
                        id="name"
                        {...field}
                        className="!m-0"
                        placeholder="Tên loại sản phẩm"
                      />
                    </FormControl>
                    <FormMessage className="col-[2/3]" />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="parent"
              render={({ field }) => {
                return (
                  <FormItem className="grid grid-cols-[120px_auto] w-full gap-x-6">
                    <FormLabel className="font-semibold text-right mt-2">
                      loại sản phẩm cha
                    </FormLabel>

                    <FormControl className="w-full">
                      <Input
                        readOnly
                        {...field}
                        value={field.value || ""}
                        onClick={() => setIsOpenCategorySelector(true)}
                        className="!m-0"
                        placeholder="Click để chọn loại sản phẩm cha"
                      />
                    </FormControl>
                    <FormMessage className="col-[2/3]" />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="image.sample"
              render={({ field }) => {
                const categoryImages = field.value || [];
                const urls = categoryImages.map((item: File | string) => {
                  if (typeof item === "string") {
                    return item;
                  }
                  return URL.createObjectURL(item);
                });
                return (
                  <FormItem className="grid grid-cols-[120px_auto] w-full gap-x-6">
                    <FormLabel className="font-semibold text-right mt-2">
                      Hình ảnh mẫu sản phẩm
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <div className="!m-0 flex flex-col gap-1 h-auto">
                      <FormControl>
                        <div className="inline-flex gap-6 flex-wrap">
                          {urls.map((url: string, index: number) => (
                            <div
                              key={index}
                              className="relative aspect-square group"
                            >
                              <Image
                                src={url}
                                alt={`Product ${index + 1}`}
                                className="rounded-lg object-contain w-28 h-28"
                                width={112}
                                height={112}
                                placeholder="blur"
                                blurDataURL="/images/blur-image.png"
                              />
                              <div
                                className="w-full absolute bottom-0 h-fit group-hover:opacity-100 
                        flex items-center justify-center gap-2 opacity-0 transition-opacity duration-200 bg-lime-50"
                              >
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="bg-transparent text-gray-700 shadow-none hover:bg-transparent hover:text-gray-700 "
                                  onClick={() => deleteImage(index, field)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <div className="relative aspect-square">
                            <Input
                              type="file"
                              accept="image/*"
                              multiple
                              className="absolute inset-0 cursor-pointer opacity-0"
                              onChange={(e) => {
                                handleImageUpload(e, field);
                              }}
                              ref={categorySampleImageRef}
                            />
                            {categoryImages.length <
                              MAX_CATEGORY_SAMPLE_IMAGES && (
                              <button
                                className="w-28 h-28 flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer"
                                onClick={() =>
                                  categorySampleImageRef.current?.click()
                                }
                                type="button"
                              >
                                <ImagePlus className="h-6 w-6 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground mx mt-2">
                                  Thêm hình ảnh
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {categoryImages.length}/
                                  {MAX_CATEGORY_SAMPLE_IMAGES}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="image.featured"
              render={({ field }) => {
                const categoryImage = field.value || "";
                let url;
                if (categoryImage) {
                  url =
                    typeof categoryImage === "string"
                      ? categoryImage
                      : URL.createObjectURL(categoryImage);
                }

                return (
                  <FormItem className="grid grid-cols-[120px_auto] w-full gap-x-6">
                    <FormLabel className="font-semibold text-right mt-2">
                      Hình ảnh cho loại sản phẩm
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <div className="!m-0 flex flex-col gap-1 h-auto">
                      <FormControl>
                        <div className="inline-flex gap-6 flex-wrap">
                          {url && (
                            <div className="relative aspect-square group">
                              <Image
                                src={url}
                                alt={`Category image`}
                                className="rounded-lg object-contain w-28 h-28"
                                width={112}
                                height={112}
                                placeholder="blur"
                                blurDataURL="/images/blur-image.png"
                              />
                              <div
                                className="w-full absolute bottom-0 h-fit group-hover:opacity-100 
                        flex items-center justify-center gap-2 opacity-0 transition-opacity duration-200 bg-lime-50"
                              >
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="bg-transparent text-gray-700 shadow-none hover:bg-transparent hover:text-gray-700 "
                                  onClick={() => field.onChange("")}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                          <div className="relative aspect-square">
                            <Input
                              type="file"
                              accept="image/*"
                              multiple
                              className="absolute inset-0 cursor-pointer opacity-0"
                              onChange={(e) => {
                                handleImageUpload(e, field);
                              }}
                              ref={categoryFeaturedImageRef}
                            />
                            {!url && (
                              <button
                                className="w-28 h-28 flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer"
                                onClick={() =>
                                  categoryFeaturedImageRef.current?.click()
                                }
                                type="button"
                              >
                                <ImagePlus className="h-6 w-6 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground mx mt-2">
                                  Thêm hình ảnh
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="attributes"
              render={({ field }) => {
                return (
                  <FormItem className="grid grid-cols-[120px_auto] w-full gap-x-6">
                    <FormLabel className="font-semibold text-right mt-2">
                      Thuộc tính
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <div className="!m-0">
                      <div className="flex space-x-2 mb-2">
                        <Input
                          id="attribute_value"
                          placeholder="Thương hiệu, xuất xứ, màu sắc, kích thước ..."
                          ref={attributeInputRef}
                          className="!m-0"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (!attributeInputRef.current?.value) return;
                            const attributeSet = new Set(field.value);
                            attributeSet.add(attributeInputRef.current?.value);
                            field.onChange([...attributeSet]);
                            attributeInputRef.current.value = "";
                          }}
                        >
                          Thêm
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {field.value?.length > 0 &&
                          field.value.map((attr: string) => (
                            <div
                              key={attr}
                              className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm"
                            >
                              {attr}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="ml-2 h-4 w-4 p-0"
                                onClick={() => {
                                  field.onChange([
                                    ...field.value.filter(
                                      (item: string) => item !== attr
                                    ),
                                  ]);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                      </div>
                      <FormControl className="w-full">
                        <Input readOnly {...field} className="!m-0 hidden" />
                      </FormControl>
                      <FormMessage className="col-[2/3]" />
                    </div>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <FormItem className="grid grid-cols-[120px_auto] w-full gap-x-6">
                    <FormLabel className=" font-semibold text-right mt-2">
                      Miêu tả
                    </FormLabel>
                    <FormControl className="w-full">
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        rows={4}
                        className="!m-0"
                        placeholder="Miêu tả cho loại sản phẩm"
                      />
                    </FormControl>
                    <FormMessage className="col-[2/3]" />
                  </FormItem>
                );
              }}
            />

            <Button onClick={() => {}} className="self-end">
              Thêm loại sản phẩm
            </Button>
          </form>
        </Form>
      </Card>

      <CategorySelector
        open={isOpenCategorySelector}
        onOpenChange={() => setIsOpenCategorySelector(false)}
        onSelect={(path) => {
          form.setValue("parent", path[path.length - 1] || "");
          form.trigger("parent");
        }}
        title="Chọn danh mục cha"
        isAllowChooseParent={true}
      ></CategorySelector>
    </div>
  );
}
