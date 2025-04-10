"use client";

import Image from "next/image";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AppBreadcrumb({
  src = "/images/breadcrumb.jpg",
  breadcrumbItems,
  pageTitle,
}: {
  src?: string;
  pageTitle: string;
  breadcrumbItems: { title: string; href?: string }[];
}) {
  return (
    <div className="relative">
      <Image
        src={src}
        alt="Hero Image"
        width={1500}
        height={607}
        className="!w-screen m-auto object-cover !h-52 lg:-top-7 relative z-10 rounded-sm"
        layout="responsive"
      ></Image>

      <div className="absolute top-0 w-full h-full z-20  lg:-top-7 left-0 ">
        <div className="absolute w-full h-full z-20 top-0 left-0 bg-gradient-to-t from-[#000000cc] to-[#0000004d] "></div>
        <div className="z-30 relative flex flex-col items-center justify-center h-full">
          <h3 className="text-white text-2xl font-semibold">{pageTitle}</h3>
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <div key={index} className="flex items-center">
                  <BreadcrumbItem className={`cursor-pointer text-white`}>
                    <BreadcrumbLink
                      href={item.href}
                      className={`cursor-pointer hover:text-lime-500 ${
                        index === breadcrumbItems.length - 1
                          ? "text-lime-500"
                          : "text-white"
                      }`}
                    >
                      {item.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {index < breadcrumbItems.length - 1 && (
                    <BreadcrumbSeparator className="text-white" />
                  )}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </div>
  );
}
