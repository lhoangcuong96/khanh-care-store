"use client";

import { ImagePlus, X } from "lucide-react";
import { CiEdit } from "react-icons/ci";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

import { ImageEditor } from "@/components/ui/image-editor";
import { Input } from "@/components/ui/input";
import envConfig from "@/envConfig";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Editor } from "@tinymce/tinymce-react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useRef } from "react";
import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";
import CategoryDropdown from "./category-dropdown";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILE_SIZE = 300 * 1024 * 1024; // 300MB
export const MAX_PRODUCT_IMAGES = 9;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ProductCreationBaseFormSchema = z.object({
  thumbnail: z
    .union(
      [
        z.instanceof(File, {
          message: "Hình ảnh không hợp lệ",
        }),
        z.string().url({
          message: "Hình ảnh không hợp lệ",
        }),
      ],
      {
        required_error: "Vui lòng chọn hình ảnh sản phẩm",
      }
    )
    .refine((file) => {
      return file instanceof File
        ? ACCEPTED_IMAGE_TYPES.includes(file.type)
        : true;
    }, "Chỉ chấp nhận các định dạng ảnh: JPG, PNG, WEBP")
    .refine((file) => {
      return file instanceof File ? file.size <= MAX_IMAGE_SIZE : true;
    }, `Hình ảnh không được vượt quá ${MAX_IMAGE_SIZE / 1024 / 1024}MB`),
  productGallery: z
    .array(
      z.union([
        z.instanceof(File, {
          message: "Hình ảnh không hợp lệ",
        }),
        z.string().url({
          message: "Hình ảnh không hợp lệ",
        }),
      ])
    )
    .refine((files) => {
      return files.every((file) => file instanceof File);
    }, "Vui lòng chọn hình ảnh sản phẩm")
    .refine((files) => {
      return files.every((file) => {
        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      });
    }, "Chỉ chấp nhận các định dạng ảnh: JPG, PNG, WEBP")
    .refine((files) => {
      return files.every((file) => file.size <= MAX_IMAGE_SIZE);
    }, `Hình ảnh không được vượt quá ${MAX_IMAGE_SIZE / 1024 / 1024}MB`),
  name: z
    .string()
    .min(10, "Tên sản phẩm phải có ít nhất 10 ký tự")
    .max(120, "Tên sản phẩm không được vượt quá 120 ký tự"),
  weight: z
    .number({
      required_error: "Vui lòng nhập khối lượng sản phẩm",
    })
    .min(0, "Khối lượng sản phẩm phải lớn hơn hoặc bằng 0")
    .max(1000000, "Khối lượng sản phẩm không được vượt quá 1000kg"),

  description: z
    .string()
    .min(1, "Vui lòng nhập mô tả sản phẩm")
    .max(100000, "Mô tả sản phẩm không được vượt quá 100000 ký tự"),
  price: z
    .number({
      required_error: "Vui lòng nhập giá bán",
    })
    .min(1, "Vui lòng nhập giá bán"),
  stock: z
    .number({
      required_error: "Vui lòng nhập số lượng",
    })
    .min(1, "Vui lòng nhập số lượng"),
  isFeatured: z.boolean(),
  isBestSeller: z.boolean(),
  tags: z.array(z.any()).optional(),
});
export type ProductCreationBaseFormValues = z.infer<
  typeof ProductCreationBaseFormSchema
>;

export default function ProductBasicInfo() {
  const form = useFormContext();

  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isEditorLoading, setIsEditorLoading] = useState(true);

  const productImageRef = useRef<HTMLInputElement>(null);

  const productGalleryRef = useRef<HTMLInputElement>(null);

  const handleMultipleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, "productGallery">
  ) => {
    const files = e.target.files;
    if (!files) return;

    const currentImages = field.value || [];
    const newImages = [...currentImages];

    // Add new files to the array
    for (let i = 0; i < files.length; i++) {
      if (newImages.length < MAX_PRODUCT_IMAGES) {
        newImages.push(files[i]);
      }
    }

    field.onChange(newImages);
    e.target.value = "";
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const files = e.target.files;
    if (!files) return;
    field.onChange(files[0]);
    e.target.value = "";
  };

  const deleteProductSlideImages = (
    index: number,
    field: ControllerRenderProps<FieldValues, "productGallery">
  ) => {
    const images = field.value || [];
    if (images[index]) {
      const newImages = [...images];
      newImages.splice(index, 1);
      field.onChange(newImages);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
      <div className="rounded-lg border bg-white p-6 flex flex-col gap-6">
        <h2 className="mb-4 text-lg font-bold">Thông tin cơ bản</h2>

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => {
            const thumbnail = field.value || "";
            let url = "";
            if (typeof thumbnail === "string") {
              url = thumbnail;
            } else {
              url = URL.createObjectURL(thumbnail);
            }
            return (
              <FormItem className="grid grid-cols-1 md:grid-cols-[max-content_auto] gap-2">
                <FormLabel className="w-36 pt-2 font-bold">
                  Hình ảnh sản phẩm (Hình ảnh hiển thị trong danh sách sản phẩm)
                  <span className="text-destructive">*</span>
                </FormLabel>
                <div className="!m-0 h-auto">
                  <FormControl>
                    <div className="inline-flex flex-wrap">
                      {url ? (
                        <div className="relative group">
                          <Image
                            src={url}
                            alt={`Product image`}
                            className="rounded-lg object-cover h-[112px]"
                            width={150}
                            height={112}
                            placeholder="blur"
                            blurDataURL="/images/blur-image.png"
                          />
                          <div
                            className="w-full absolute bottom-0 h-fit group-hover:opacity-100 
                    flex items-center justify-center gap-2 opacity-0 transition-opacity duration-200 bg-slate-50"
                          >
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="bg-transparent text-gray-700 shadow-none hover:bg-transparent hover:text-gray-700 "
                              onClick={() => setEditedImage(url)}
                            >
                              <CiEdit className="h-4 w-4" />
                            </Button>
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
                      ) : (
                        <>
                          <div className="relative">
                            <Input
                              type="file"
                              accept="image/*"
                              multiple
                              className="absolute inset-0 cursor-pointer opacity-0"
                              onChange={(e) => {
                                handleImageUpload(e, field);
                              }}
                              ref={productImageRef}
                            />
                          </div>
                          <div
                            className="w-[150px] h-28 flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer"
                            onClick={() => {
                              if (productImageRef?.current) {
                                productImageRef.current.click();
                              }
                            }}
                          >
                            <ImagePlus className="h-6 w-6 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground mx mt-2">
                              Thêm hình ảnh
                            </span>
                            <span className="text-xs text-muted-foreground">
                              0/1
                            </span>
                          </div>
                        </>
                      )}
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
          name="productGallery"
          render={({ field }) => {
            const images = field.value || [];
            return (
              <FormItem className="grid grid-cols-1 md:grid-cols-[max-content_auto] gap-2">
                <FormLabel className="w-36 pt-2 font-bold">
                  Hình ảnh slide sản phẩm
                </FormLabel>
                <div className="!m-0 h-auto">
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {images.map((image: any, index: number) => {
                        let url = "";
                        if (typeof image === "string") {
                          url = image;
                        } else {
                          url = URL.createObjectURL(image);
                        }
                        return (
                          <div key={index} className="relative group">
                            <Image
                              src={url || "/placeholder.svg"}
                              alt={`Product slide image ${index + 1}`}
                              className="rounded-lg object-cover h-[112px]"
                              width={150}
                              height={112}
                              placeholder="blur"
                              blurDataURL="/images/blur-image.png"
                            />
                            <div
                              className="w-full absolute bottom-0 h-fit group-hover:opacity-100 
                                flex items-center justify-center gap-2 opacity-0 transition-opacity duration-200 bg-slate-50"
                            >
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="bg-transparent text-gray-700 shadow-none hover:bg-transparent hover:text-gray-700"
                                onClick={() => setEditedImage(url)}
                              >
                                <CiEdit className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="bg-transparent text-gray-700 shadow-none hover:bg-transparent hover:text-gray-700"
                                onClick={() =>
                                  deleteProductSlideImages(index, field)
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                      {images.length < MAX_PRODUCT_IMAGES && (
                        <>
                          <div className="relative">
                            <Input
                              type="file"
                              accept="image/*"
                              multiple
                              className="absolute inset-0 cursor-pointer opacity-0"
                              onChange={(e) => {
                                handleMultipleImageUpload(e, field);
                              }}
                              ref={productGalleryRef}
                            />
                          </div>
                          <div
                            className="w-[150px] h-28 flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer"
                            onClick={() => {
                              if (productGalleryRef?.current) {
                                productGalleryRef.current.click();
                              }
                            }}
                          >
                            <ImagePlus className="h-6 w-6 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground mx mt-2">
                              Thêm hình ảnh slide
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {images.length}/{MAX_PRODUCT_IMAGES}
                            </span>
                          </div>
                        </>
                      )}
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
          name="name"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 md:grid-cols-[max-content_auto] gap-2">
              <FormLabel className="w-36 pt-2 font-bold">
                Tên sản phẩm <span className="text-destructive">*</span>
              </FormLabel>
              <div className="!m-0">
                <FormControl>
                  <div className="relative inline-flex items-center w-full gap-6">
                    <Input {...field} placeholder="Tên sản phẩm" />
                    <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">
                      {field.value?.length}/120
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 md:grid-cols-[max-content_auto] gap-2">
              <FormLabel className="w-36 pt-2 font-bold">
                Loại sản phẩm <span className="text-destructive">*</span>
              </FormLabel>
              <div className="!m-0">
                <FormControl>
                  <div className="relative inline-flex items-center w-full gap-6">
                    <CategoryDropdown
                      onSelect={(category) => {
                        field.onChange(category.id);
                      }}
                      value={field.value}
                      required={true}
                      placeholder="Chọn loại sản phẩm"
                    ></CategoryDropdown>
                  </div>
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 md:grid-cols-[max-content_auto] gap-2">
              <FormLabel className="w-36 pt-2 font-bold">
                Mô tả sản phẩm <span className="text-destructive">*</span>
              </FormLabel>
              <div className="!m-0">
                <FormControl>
                  <div className="relative min-h-[400px]">
                    {isEditorLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    )}
                    <Editor
                      apiKey={envConfig?.NEXT_PUBLIC_TINYMCE_API_KEY}
                      value={field.value}
                      onEditorChange={field.onChange}
                      onBlur={field.onBlur}
                      onInit={() => {
                        setIsEditorLoading(false);
                      }}
                      init={{
                        height: 400,
                        menubar: true,
                        language: "vi",
                        plugins: [
                          "advlist",
                          "autolink",
                          "lists",
                          "link",
                          "image",
                          "charmap",
                          "preview",
                          "anchor",
                          "searchreplace",
                          "visualblocks",
                          "code",
                          "fullscreen",
                          "insertdatetime",
                          "media",
                          "table",
                          "code",
                          "help",
                          "wordcount",
                        ],
                        toolbar:
                          "undo redo | blocks | " +
                          "bold italic forecolor | alignleft aligncenter " +
                          "alignright alignjustify | bullist numlist outdent indent | " +
                          "removeformat | help",
                        content_style:
                          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                      }}
                    />
                  </div>
                </FormControl>
                <div className="inline-flex justify-between w-full gap-6">
                  <FormMessage />
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">
                      {field.value?.length}/100000
                    </span>
                  </div>
                </div>
              </div>
            </FormItem>
          )}
        />
        {editedImage && (
          <ImageEditor
            open={true}
            imageUrl={editedImage}
            onSave={() => {}}
            onOpenChange={() => {
              setEditedImage(null);
            }}
          ></ImageEditor>
        )}
      </div>
      <div className="rounded-lg border bg-white p-6 flex flex-col gap-6">
        <h2 className="mb-4 text-lg font-bold">Thông tin bán hàng</h2>

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 md:grid-cols-[max-content_auto] gap-2">
              <FormLabel className="font-bold">
                Giá bán(đ) <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Nhập giá bán"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
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
            <FormItem className="grid grid-cols-1 md:grid-cols-[max-content_auto] gap-2">
              <FormLabel className="font-bold">
                Số lượng <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Nhập số lượng"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
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
            <FormItem className="flex flex-row items-center md:grid-cols-[max-content_auto] gap-2">
              <FormLabel className="font-bold">
                Sản phẩm nổi bật <span className="text-destructive"></span>
              </FormLabel>
              <FormControl>
                <Checkbox
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
            <FormItem className="flex flex-row items-center md:grid-cols-[max-content_auto] gap-2">
              <FormLabel className="font-bold">
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
    </div>
  );
}
