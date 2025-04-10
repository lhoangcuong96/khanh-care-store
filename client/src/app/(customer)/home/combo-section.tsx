import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const comboProducts = [
  {
    id: 1,
    title: "[COMBO] Tiệm rửa xe máy 1 người làm",
    image: "/products/combo-1.jpg",
    originalPrice: "13,200,000đ",
    salePrice: "12,100,000đ",
  },
  {
    id: 2,
    title: "[COMBO] Tiệm rửa xe máy 2 người làm",
    image: "/products/combo-2.jpg",
    originalPrice: "20,310,000đ",
    salePrice: "17,560,000đ",
  },
  {
    id: 3,
    title: "[COMBO] Tiệm rửa xe ô tô khủng cấu rửa rẻ",
    image: "/products/combo-3.jpg",
    originalPrice: "22,700,000đ",
    salePrice: "21,200,000đ",
  },
  {
    id: 4,
    title: "[COMBO] Tiệm rửa xe ô tô cấu cơ",
    image: "/products/combo-4.jpg",
    originalPrice: "61,000,000đ",
    salePrice: "55,600,000đ",
  },
]

export default function ComboSection() {
  return (
    <section className="py-8">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900 uppercase">COMBO HẤP DẪN</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" id="combo-prev">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" id="combo-next">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {comboProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-blue-700 mb-2 line-clamp-2">{product.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground line-through">{product.originalPrice}</span>
                      <span className="text-base font-bold text-orange-500">{product.salePrice}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
