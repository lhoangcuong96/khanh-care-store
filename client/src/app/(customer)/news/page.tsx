import React from "react";
import Image from "next/image";
import Link from "next/link";
import AppBreadcrumb from "@/components/customer/layout/breadcrumb";
import { routePath } from "@/constants/routes";
import newsRequestApis from "@/api-request/news";
import { NewsListQueryType } from "@/validation-schema/news.schema";

const ITEMS_PER_PAGE = 6;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.search || "";

  // Fetch news data from API
  const queryParams: NewsListQueryType = {
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery || undefined,
  };

  const {
    data: newsData,
    total,
    limit,
  } = await newsRequestApis.getNews(queryParams);
  const totalPages = Math.ceil(total / limit);

  // Get featured news
  const featuredNews = newsData.filter((news) => news.isFeatured).slice(0, 3);

  // Generate pagination links
  const getPaginationLinks = () => {
    const links = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous page link
    if (currentPage > 1) {
      links.push(
        <Link
          key="prev"
          href={`/news?page=${currentPage - 1}${
            searchQuery ? `&search=${searchQuery}` : ""
          }`}
          className="px-3 py-2 rounded-md hover:bg-slate-200"
        >
          &laquo;
        </Link>
      );
    }

    // First page
    if (startPage > 1) {
      links.push(
        <Link
          key="1"
          href={`/news?page=1${searchQuery ? `&search=${searchQuery}` : ""}`}
          className="px-3 py-2 rounded-md hover:bg-slate-200"
        >
          1
        </Link>
      );
      if (startPage > 2) {
        links.push(
          <span key="start-ellipsis" className="px-2">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <Link
          key={i}
          href={`/news?page=${i}${searchQuery ? `&search=${searchQuery}` : ""}`}
          className={`px-3 py-2 rounded-md ${
            currentPage === i ? "bg-slate-600 text-white" : "hover:bg-slate-200"
          }`}
        >
          {i}
        </Link>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        links.push(
          <span key="end-ellipsis" className="px-2">
            ...
          </span>
        );
      }
      links.push(
        <Link
          key={totalPages}
          href={`/news?page=${totalPages}${
            searchQuery ? `&search=${searchQuery}` : ""
          }`}
          className="px-3 py-2 rounded-md hover:bg-slate-200"
        >
          {totalPages}
        </Link>
      );
    }

    // Next page link
    if (currentPage < totalPages) {
      links.push(
        <Link
          key="next"
          href={`/news?page=${currentPage + 1}${
            searchQuery ? `&search=${searchQuery}` : ""
          }`}
          className="px-3 py-2 rounded-md hover:bg-slate-200"
        >
          &raquo;
        </Link>
      );
    }

    return links;
  };

  return (
    <div className="flex flex-col w-full items-center justify-center h-full text-sm font-medium">
      <AppBreadcrumb
        pageTitle={"Tin tức"}
        breadcrumbItems={[
          {
            title: "Trang chủ",
            href: routePath.customer.home,
          },
          {
            title: "Tin tức",
          },
        ]}
      />
      <div className="w-screen p-8 flex items-center justify-center h-full">
        <div className="w-full max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Bar */}
          <div className="lg:col-span-3">
            <form className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Tìm kiếm tin tức..."
                  defaultValue={searchQuery}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-slate-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* News List */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {newsData.length > 0 ? (
              newsData.map((news) => (
                <div
                  key={news.id}
                  className="bg-slate-100 rounded-lg overflow-hidden shadow hover:shadow-lg transition relative"
                >
                  <div className="relative h-48">
                    <Image
                      src={news.image.thumbnail}
                      alt={news.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-slate-700 text-white rounded px-2 py-1 text-xs font-semibold text-center">
                      <div>{new Date(news.createdAt).getDate()}</div>
                      <div>Tháng {new Date(news.createdAt).getMonth() + 1}</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="font-bold text-lg mb-2 line-clamp-2">
                      {news.title}
                    </h2>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {news.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/news/${news.slug}`}
                        className="inline-block px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 text-sm font-medium"
                      >
                        Đọc tiếp
                      </Link>
                      <span className="text-gray-500 text-sm">
                        {news.viewCount} lượt xem
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="lg:col-span-3 flex flex-col items-center justify-center py-12 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {searchQuery
                    ? "Không tìm thấy kết quả phù hợp"
                    : "Chưa có tin tức nào"}
                </h3>
                <p className="text-gray-500">
                  {searchQuery
                    ? "Vui lòng thử lại với từ khóa khác"
                    : "Vui lòng quay lại sau"}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured News */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-1">
                Tin tức nổi bật
                <span role="img" aria-label="leaf">
                  🍃
                </span>
              </h3>
              {featuredNews.length > 0 ? (
                <ul className="space-y-3">
                  {featuredNews.map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      <div className="relative w-14 h-14 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={item.image.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <Link
                        href={`/news/${item.slug}`}
                        className="text-sm font-medium hover:underline line-clamp-2"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">Chưa có tin tức nổi bật</p>
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && newsData.length > 0 && (
            <div className="lg:col-span-3 flex justify-center items-center space-x-2 mt-8">
              {getPaginationLinks()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
