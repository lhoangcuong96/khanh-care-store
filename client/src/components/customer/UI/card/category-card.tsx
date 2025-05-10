import { Card } from "@/components/ui/card";
import { FeaturedCategoryType } from "@/validation-schema/category";
import Image from "next/image";

export default function CategoryCard({
  category,
}: {
  category: FeaturedCategoryType;
}) {
  return (
    <Card className="w-24 flex flex-col items-center m-[4px] shadow-none border-none hover:outline-none hover:scale-110 rounded-sm overflow-hidden">
      <Image
        src={category.image || ""}
        alt={category.name}
        width={100}
        height={100}
        className="w-24 h-24 object-contain rounded-sm"
      ></Image>
      <p className="font-semibold mt-2 text-slate-600 text-center">
        {category.name}
      </p>
    </Card>
  );
}
