import { Card } from "@/components/ui/card";
import { Category } from "@prisma/client";
import Image from "next/image";

export default function CategoryCard({
  category,
}: {
  category: Partial<Category>;
}) {
  return (
    <Card className="w-24 flex flex-col items-center m-[4px] shadow-none border-none hover:outline-none hover:scale-110 rounded-sm overflow-hidden">
      <Image
        src={category.image?.thumbnail || ""}
        alt={category.description ? category.description : "Category image"}
        width={100}
        height={100}
      ></Image>
      <p className="font-semibold mt-2 text-lime-600 text-center">
        {category.name}
      </p>
    </Card>
  );
}
