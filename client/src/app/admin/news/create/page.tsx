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
import { useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X, Upload } from "lucide-react";
import Image from "next/image";
import useHandleStore from "@/hooks/use-handle-store";
import { useRouter } from "next/navigation";
import { adminNewsApiRequest } from "@/api-request/admin/news";
import { routePath } from "@/constants/routes";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Tiêu đề phải có ít nhất 2 ký tự.",
  }),
  slug: z.string().min(2, {
    message: "Slug phải có ít nhất 2 ký tự.",
  }),
  summary: z.string().min(10, {
    message: "Tóm tắt phải có ít nhất 10 ký tự.",
  }),
  content: z.string().min(10, {
    message: "Nội dung phải có ít nhất 10 ký tự.",
  }),
  image: z.object({
    url: z.string().url({
      message: "Vui lòng nhập URL hình ảnh hợp lệ.",
    }),
    alt: z.string().optional(),
  }),
  author: z.string().min(2, {
    message: "Tên tác giả phải có ít nhất 2 ký tự.",
  }),
  tags: z.array(z.string()).min(1, {
    message: "Phải có ít nhất 1 tag.",
  }),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  publishedAt: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).default([]),
});

export default function CreateNewsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditorLoading, setIsEditorLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const { toast } = useToast();
  const { uploadFile } = useHandleStore();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      content: "",
      image: {
        url: "",
        alt: "",
      },
      author: "",
      tags: [],
      isPublished: false,
      isFeatured: false,
      publishedAt: new Date().toISOString().split("T")[0],
      metaTitle: "",
      metaDescription: "",
      metaKeywords: [],
    },
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Watch title changes to auto-generate slug
  const title = form.watch("title");
  useEffect(() => {
    if (title) {
      form.setValue("slug", generateSlug(title));
    }
  }, [title, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await uploadFile(file);
        if (imageUrl) {
          form.setValue("image.url", imageUrl);
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

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      const newTags = [...tags, currentTag];
      setTags(newTags);
      form.setValue("tags", newTags);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const imageData = {
        thumbnail: values.image.url,
        gallery: [],
      };
      await adminNewsApiRequest.create({
        ...values,
        image: imageData,
      });
      toast({
        title: "Tạo bài viết thành công!",
        description: "Bài viết đã được tạo thành công.",
        variant: "success",
      });
      router.push(routePath.admin.news.list);
    } catch (error) {
      console.error("Error creating news:", error);
      toast({
        title: "Lỗi khi tạo bài viết!",
        description: "Có lỗi xảy ra khi tạo bài viết.",
        variant: "destructive",
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu đề bài viết" {...field} />
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
                        <Input placeholder="URL bài viết" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tóm tắt</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tóm tắt bài viết" {...field} />
                    </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tác giả</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên tác giả" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày đăng</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Nhập tag"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTag();
                              }
                            }}
                          />
                          <Button type="button" onClick={handleAddTag}>
                            Thêm
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <div
                              key={tag}
                              className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
                            >
                              <span>{tag}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FormControl>
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
                        {(imagePreview || field.value.url) && (
                          <div className="relative w-24 h-24 border rounded-md overflow-hidden group">
                            <Image
                              src={
                                imagePreview ||
                                field.value.url ||
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
                                  field.onChange({ url: "", alt: "" });
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Xuất bản ngay</FormLabel>
                        <FormDescription>
                          Bài viết sẽ được xuất bản ngay sau khi tạo
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Nổi bật</FormLabel>
                        <FormDescription>
                          Hiển thị bài viết ở vị trí nổi bật
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">SEO</h3>
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Meta title cho SEO" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Meta description cho SEO"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Keywords</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập keywords, phân cách bằng dấu phẩy"
                          onChange={(e) => {
                            const keywords = e.target.value
                              .split(",")
                              .map((k) => k.trim())
                              .filter(Boolean);
                            field.onChange(keywords);
                          }}
                        />
                      </FormControl>
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
