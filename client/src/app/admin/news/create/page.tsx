"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X, Upload } from "lucide-react";
import Image from "next/image";
import useHandleStore from "@/hooks/use-handle-store";
import { useRouter } from "next/navigation";
import { adminNewsApiRequest } from "@/api-request/admin/news";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Tiêu đề phải có ít nhất 2 ký tự.",
  }),
  content: z.string().min(10, {
    message: "Nội dung phải có ít nhất 10 ký tự.",
  }),
  image: z.string().url({
    message: "Vui lòng nhập URL hình ảnh hợp lệ.",
  }),
  date: z.string({
    required_error: "Vui lòng chọn ngày đăng.",
  }),
});

export default function CreateNewsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditorLoading, setIsEditorLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { uploadFile } = useHandleStore();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      image: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await uploadFile(file);
        if (imageUrl) {
          form.setValue("image", imageUrl);
          setImagePreview(imageUrl);
        } else {
          toast({
            title: "Lỗi",
            description: "Đã xảy ra lỗi khi tải lên hình ảnh",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Đã xảy ra lỗi khi tải lên hình ảnh",
          variant: "destructive",
        });
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await adminNewsApiRequest.create(values);
      toast({
        title: "Tạo bài viết thành công!",
        description: "Bài viết đã được tạo thành công.",
        variant: "success",
      });
      router.push("/admin/news");
    } catch (error) {
      console.error("Error creating news:", error);
      toast({
        title: "Lỗi khi tạo bài viết!",
        description: "Có lỗi xảy ra khi tạo bài viết.",
        variant: "warning",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tạo Bài Viết Mới</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tạo Bài Viết</CardTitle>
          <CardDescription>
            Điền thông tin bài viết mới vào form bên dưới.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề bài viết" {...field} />
                    </FormControl>
                    <FormDescription>
                      Tiêu đề bài viết sẽ hiển thị trên trang chủ.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung</FormLabel>
                    <FormControl>
                      <div className="relative">
                        {isEditorLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                          </div>
                        )}
                        <Editor
                          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                          init={{
                            height: 500,
                            menubar: true,
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
                            setup: (editor: any) => {
                              editor.on("init", () => {
                                setIsEditorLoading(false);
                              });
                            },
                          }}
                          onEditorChange={(content) => {
                            field.onChange(content);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Nội dung bài viết sẽ hiển thị khi người dùng xem chi tiết.
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
                    <FormLabel>Hình ảnh</FormLabel>
                    <div className="flex items-center gap-4">
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="news-image"
                          onChange={handleImageUpload}
                          ref={imageInputRef}
                        />
                      </FormControl>
                      <div className="flex items-center gap-4">
                        {(imagePreview || field.value) && (
                          <div className="relative w-24 h-24 border rounded-md overflow-hidden group">
                            <Image
                              src={
                                imagePreview ||
                                field.value ||
                                "/placeholder.svg"
                              }
                              alt="News preview"
                              className="w-full h-full object-cover"
                              width={96}
                              height={96}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  field.onChange("");
                                  setImagePreview(null);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        <label
                          htmlFor="news-image"
                          className="flex items-center justify-center px-4 py-2 border border-dashed rounded-md cursor-pointer hover:bg-muted"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Tải lên hình ảnh
                        </label>
                      </div>
                    </div>
                    <FormDescription>
                      Tải lên hình ảnh đại diện cho bài viết. Kích thước khuyến
                      nghị: 800x400px.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày đăng</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        Chọn ngày đăng bài viết.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang tạo..." : "Tạo bài viết"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
