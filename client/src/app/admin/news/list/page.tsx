import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { routePath } from "@/constants/routes";
import { Plus } from "lucide-react";
import Link from "next/link";
import { NewsList } from "./news-lists";
import prisma from "@/lib/prisma";
import { NewsListQuerySchema } from "@/validation-schema/admin/admin-news-schema";
import { adminNewsApiRequest } from "@/api-request/admin/news";

interface PageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    isPublished?: string;
    isFeatured?: string;
  };
}

async function getNews(searchParams: PageProps["searchParams"]) {
  try {
    const validatedParams = NewsListQuerySchema.parse({
      page: searchParams.page ? parseInt(searchParams.page) : 1,
      limit: searchParams.limit ? parseInt(searchParams.limit) : 10,
      search: searchParams.search,
      isPublished: searchParams.isPublished
        ? searchParams.isPublished === "true"
        : undefined,
      isFeatured: searchParams.isFeatured
        ? searchParams.isFeatured === "true"
        : undefined,
    });

    const response = await adminNewsApiRequest.getAll(validatedParams);
    if (!response.payload) {
      throw new Error("Không có dữ liệu");
    }
    const {
      data: news,
      total,
      currentPage,
      limit,
      totalPages,
    } = response.payload;

    return {
      news,
      total,
      currentPage,
      limit,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching news:", error);
    return {
      news: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
      currentPage: 1,
      error: "Lỗi khi lấy danh sách bài viết",
    };
  }
}

export default async function NewsListPage(props: {
  searchParams?: Promise<PageProps["searchParams"]>;
}) {
  const searchParams: PageProps["searchParams"] | undefined =
    await props.searchParams;

  const { news, total, currentPage, limit, totalPages, error } = await getNews(
    searchParams || {
      page: "1",
      limit: "10",
      search: "",
      isPublished: undefined,
      isFeatured: undefined,
    }
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý bài viết</h2>
        <Button asChild>
          <Link href={routePath.admin.news.create}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo bài viết mới
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài viết</CardTitle>
          <CardDescription>
            Quản lý và chỉnh sửa các bài viết của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewsList
            news={news}
            total={total}
            currentPage={currentPage}
            limit={limit}
            searchParams={searchParams}
            totalPages={totalPages}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
}
