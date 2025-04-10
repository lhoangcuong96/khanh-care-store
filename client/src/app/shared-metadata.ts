import { Metadata } from "next";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

export const sharedMetadata: Metadata = {
  authors: [{ name: "Heo sạch nhà Thoa" }],
  publisher: "Heo sạch nhà Thoa",
  creator: "Heo sạch nhà Thoa",
  generator: "Next.js",
  applicationName: "Heo sạch nhà Thoa",
};

export const sharedOpenGraph: OpenGraph = {
  type: "website",
  locale: "vi_VN",
  siteName: "Heo sạch nhà Thoa",
};
