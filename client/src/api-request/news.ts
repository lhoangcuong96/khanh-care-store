import { http } from "@/lib/http";
import {
  NewsListQueryType,
  NewsListResponseType,
  NewsSchemaType,
} from "@/validation-schema/news.schema";

const newsRequestApis = {
  getNews: async (
    queryParams: NewsListQueryType
  ): Promise<NewsListResponseType> => {
    const params = new URLSearchParams();
    if (queryParams.page) params.append("page", queryParams.page.toString());
    if (queryParams.limit) params.append("limit", queryParams.limit.toString());
    if (queryParams.search) params.append("search", queryParams.search);

    const response = await http.get<NewsListResponseType>(
      `/news?${params.toString()}`
    );
    return response.payload as NewsListResponseType;
  },

  getNewsDetail: async (slug: string): Promise<NewsSchemaType> => {
    const response = await http.get<NewsSchemaType>(`/news/${slug}`);
    return response.payload as NewsSchemaType;
  },
};

export default newsRequestApis;
