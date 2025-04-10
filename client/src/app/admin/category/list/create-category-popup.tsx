import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, Plus, X } from "lucide-react";

import { CategorySelector } from "@/components/share/category-selector";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useHandleMessage } from "@/hooks/use-handle-message";
import {
  CreateCategorySchema,
  MAX_CATEGORY_SAMPLE_IMAGES,
} from "@/validation-schema/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import Image from "next/image";
import { useRef, useState } from "react";
import { ControllerRenderProps, FieldValues, useForm } from "react-hook-form";

export default function CreateCategoryPopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isOpenCategorySelector, setIsOpenCategorySelector] = useState(false);

  const { messageApi } = useHandleMessage();

  const categorySampleImageRef = useRef<HTMLInputElement>(null);
  const attributeInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    resolver: zodResolver(CreateCategorySchema),
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
    const prevImages = field.value || [];
    const fileArray = Array.from(files);
    field.onChange([...prevImages, ...fileArray]);
    e.target.value = "";
  };

  const deleteProductImage = (
    index: number,
    field: ControllerRenderProps<FieldValues, "productImages">
  ) => {
    const images = field.value || [];
    if (images[index]) {
      const newImages = [...images];
      newImages.splice(index, 1);
      field.onChange(newImages);
    }
  };

  console.log(form.getValues());
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTrigger asChild>
          <Button className="font-bold">
            <Plus className="mr-2 h-4 w-4" /> Thêm loại sản phẩm mới
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="font-bold">
              Thêm loại sản phẩm mới
            </DialogTitle>
            <DialogDescription className="text-sm font-medium">
              Tạo danh mục mới cho sản phẩm của bạn. Nhấp vào lưu khi bạn hoàn
              tất.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => console.log(data))}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem className="grid grid-cols-[120px_auto] w-full gap-x-3">
                      <FormLabel className=" font-semibold text-right mt-2">
                        Tên
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl className="w-full">
                        <Input id="name" {...field} className="!m-0" />
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
                    <FormItem className="grid grid-cols-[120px_auto] w-full gap-x-3">
                      <FormLabel className="font-semibold text-right mt-2">
                        loại sản phẩm cha
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>

                      <FormControl className="w-full">
                        <Input
                          readOnly
                          {...field}
                          onClick={() => setIsOpenCategorySelector(true)}
                          className="!m-0"
                        />
                      </FormControl>
                      <FormMessage className="col-[2/3]" />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="productImages"
                render={({ field }) => {
                  const productImages = field.value || [];
                  const urls = productImages.map((item: File | string) => {
                    if (typeof item === "string") {
                      return item;
                    }
                    return URL.createObjectURL(item);
                  });
                  return (
                    <FormItem className="grid grid-cols-[120px_auto] w-full gap-x-3">
                      <FormLabel className="font-semibold text-right mt-2">
                        Hình ảnh mẫu sản phẩm
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <div className="!m-0 flex flex-col gap-6 h-auto">
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
                                  className="rounded-lg object-contain"
                                  width={120}
                                  height={120}
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
                                    onClick={() =>
                                      deleteProductImage(index, field)
                                    }
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
                              {productImages.length <
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
                                    {productImages.length}/
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
                name="attributes"
                render={({ field }) => {
                  return (
                    <FormItem className="grid grid-cols-[120px_auto] w-full gap-x-3">
                      <FormLabel className="font-semibold text-right mt-2">
                        Thuộc tính
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <div className="!m-0">
                        <div className="flex space-x-2 mb-2">
                          <Input
                            id="attribute_value"
                            placeholder="Add attribute"
                            ref={attributeInputRef}
                            className="!m-0"
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              const attributeSet = new Set(field.value);
                              attributeSet.add(
                                attributeInputRef.current?.value
                              );
                              field.onChange([...attributeSet]);
                            }}
                          >
                            Add
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
                    <FormItem className="grid grid-cols-[120px_auto] w-full gap-x-3">
                      <FormLabel className=" font-semibold text-right mt-2">
                        Miêu tả
                      </FormLabel>
                      <FormControl className="w-full">
                        <Textarea {...field} rows={4} className="!m-0" />
                      </FormControl>
                      <FormMessage className="col-[2/3]" />
                    </FormItem>
                  );
                }}
              />

              <Button onClick={() => {}} className="self-end">
                Thêm danh mục
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
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
    </>
  );
}
