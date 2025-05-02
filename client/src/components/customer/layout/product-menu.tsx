"use client";

import { Card } from "@/components/ui/card";
import { routePath } from "@/constants/routes";
import { useAppContext } from "@/provider/app-provider";
import Image from "next/image";
import Link from "next/link";

export function ProductMenu() {
  const { categories } = useAppContext();
  return (
    <Card className="rounded-sm p-4">
      <div className="grid grid-cols-[auto_max-content] gap-2">
        <div className="grid grid-cols-3 gap-4">
          {categories.map((category) => {
            return (
              <div key={category.name} className="flex flex-col">
                <Link
                  href={`${routePath.customer.products({
                    category: category.slug,
                  })}`}
                  className="text-green-600 font-semibold mb-2"
                >
                  {category.name}
                </Link>
              </div>
            );
          })}
        </div>
        <Image
          alt="Product Image"
          src="/images/mega-1-image.webp"
          width={205}
          height={256}
        ></Image>
      </div>
    </Card>
  );
}
