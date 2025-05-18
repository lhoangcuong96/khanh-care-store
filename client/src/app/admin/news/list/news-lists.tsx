"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { routePath } from "@/constants/routes";
import {
  Edit,
  Trash2,
  Eye,
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useState } from "react";
import { NewsInListType } from "@/validation-schema/admin/admin-news-schema";
import { useDebounceEffect } from "@/hooks/use-debounced-effect";

interface NewsListProps {
  news: NewsInListType[];
  total: number;
  currentPage: number;
  limit: number;
  totalPages: number;
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    isPublished?: string;
    isFeatured?: string;
  };
  error?: string | null;
}

function generatePageNumbers(currentPage: number, totalPages: number) {
  const pages: (number | string)[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    const start = Math.max(2, currentPage - maxVisiblePages);
    const end = Math.min(totalPages - 1, currentPage + maxVisiblePages);

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);
  }

  return pages;
}

export function NewsList({
  news,
  total,
  currentPage,
  limit,
  totalPages,
  searchParams,
  error,
}: NewsListProps) {
  const router = useRouter();
  const searchParamsObj = useSearchParams();

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy", { locale: vi });
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParamsObj.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParamsObj]
  );

  const [searchValue, setSearchValue] = useState(searchParams.search || "");

  useDebounceEffect(
    () => {
      if (searchValue !== (searchParams.search || "")) {
        handleSearch(searchValue);
      }
    },
    400,
    [searchValue]
  );

  const handleSearch = (value: string) => {
    router.push(`?${createQueryString("search", value)}`);
  };

  const handleStatusChange = (value: string) => {
    const newValue = value === "all" ? "" : value;
    router.push(`?${createQueryString("isPublished", newValue)}`);
  };

  const handleFeaturedChange = (value: string) => {
    const newValue = value === "all" ? "" : value;
    router.push(`?${createQueryString("isFeatured", newValue)}`);
  };

  const handlePageChange = (page: number) => {
    router.push(`?${createQueryString("page", page.toString())}`);
  };

  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  // Get current status value
  const currentStatus =
    searchParams.isPublished === "true"
      ? "true"
      : searchParams.isPublished === "false"
      ? "false"
      : "all";

  // Get current featured value
  const currentFeatured =
    searchParams.isFeatured === "true"
      ? "true"
      : searchParams.isFeatured === "false"
      ? "false"
      : "all";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tiêu đề, tóm tắt, tác giả hoặc tags..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select value={currentStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="true">Đã đăng</SelectItem>
              <SelectItem value="false">Bản nháp</SelectItem>
            </SelectContent>
          </Select>

          <Select value={currentFeatured} onValueChange={handleFeaturedChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Nổi bật" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả bài viết</SelectItem>
              <SelectItem value="true">Bài viết nổi bật</SelectItem>
              <SelectItem value="false">Bài viết thường</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Tiêu đề</TableHead>
            <TableHead>Tác giả</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Ngày đăng</TableHead>
            <TableHead>Lượt xem</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {error ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                {error}
              </TableCell>
            </TableRow>
          ) : null}
          {!error && news.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Không có bài viết nào
              </TableCell>
            </TableRow>
          )}
          {!error &&
            news.length > 0 &&
            news.map((news) => (
              <TableRow key={news.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="relative contents h-10 w-16 overflow-hidden rounded-md">
                      <Image
                        src={news.image.thumbnail}
                        alt={news.title}
                        width={64}
                        height={40}
                        className="object-contain w-10 h-16"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="line-clamp-1">{news.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {news.summary}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{news.author}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {news.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {formatDate(new Date(news.publishedAt || news.createdAt))}
                </TableCell>
                <TableCell>{news.viewCount.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {news.isPublished && (
                      <Badge variant="secondary">Đã đăng</Badge>
                    )}
                    {news.isFeatured && (
                      <Badge variant="default">
                        <Star className="mr-1 h-3 w-3" />
                        Nổi bật
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/news/${news.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <Link href={routePath.admin.news.edit(news.id)}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {totalPages > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Hiển thị {(currentPage - 1) * limit + 1} đến{" "}
            {Math.min(currentPage * limit, total)} của {total} bài viết
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {pageNumbers.map((page, index) =>
                page === "..." ? (
                  <span key={`ellipsis-${index}`} className="px-2">
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page as number)}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
