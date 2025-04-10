import envConfig from "@/envConfig";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${envConfig?.NEXT_PUBLIC_URL}/customer/home`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${envConfig?.NEXT_PUBLIC_URL}/customer/products`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
  ];
}
