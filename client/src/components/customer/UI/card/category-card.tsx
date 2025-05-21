import { Card } from "@/components/ui/card";
import { FeaturedCategoryType } from "@/validation-schema/category";
import Image from "next/image";

export default function CategoryCard({
  category,
}: {
  category: FeaturedCategoryType;
}) {
  return (
    <Card className="w-28 flex flex-col items-center m-1 rounded-xl overflow-hidden shadow bg-white border border-slate-100 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
      <div className="w-full h-28 flex items-center justify-center bg-slate-50 border-b border-slate-100 p-2">
        <Image
          src={category.image.thumbnail || ""}
          alt={category.name}
          width={80}
          height={80}
          className="object-contain w-20 h-20 drop-shadow-sm"
        />
      </div>
      <p
        className="font-bold mt-3 mb-2 text-slate-800 text-center text-base leading-tight line-clamp-2 w-full px-2"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {category.name}
      </p>
    </Card>
  );
}
