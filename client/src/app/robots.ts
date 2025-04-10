import envConfig from "@/envConfig";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/admin"],
    },
    sitemap: `${envConfig?.NEXT_PUBLIC_URL}/sitemap.xml`,
  };
}
