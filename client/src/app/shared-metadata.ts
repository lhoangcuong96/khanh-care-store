import { shopInfo } from "@/constants/shop-info";
import { Metadata } from "next";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

export const sharedMetadata: Metadata = {
  authors: [{ name: shopInfo.name }],
  publisher: shopInfo.name,
  creator: shopInfo.name,
  generator: "Next.js",
  applicationName: shopInfo.name,
};

export const sharedOpenGraph: OpenGraph = {
  type: "website",
  locale: "vi_VN",
  siteName: shopInfo.name,
};
