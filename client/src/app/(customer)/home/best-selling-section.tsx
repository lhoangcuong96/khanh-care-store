import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const categories = [
  { id: "may-rua-xe", label: "MÁY RỬA XE" },
  { id: "may-nen-khi", label: "MÁY NÉN KHÍ" },
  { id: "cau-nang", label: "CẦU NÂNG" },
  { id: "binh-bot", label: "BÌNH BỌT" },
  { id: "khac", label: "KHÁC" },
]

const products = {
  "may-rua-xe": [
    {
      id: 1,
      title: "Máy rửa xe cao áp Tahico T-3600",
      image: "/products/may-rua-xe-1.jpg",
      price: "3,200,000đ",
      sale: true,
    },
    {
      id: 2,
      title: "Máy rửa xe cao áp Tahico T-5000",
      image: "/products/may-rua-xe-2.jpg",
      price: "5,500,000đ",
      sale: true,
    },
  ],
  "may-nen-khi": [
    {
      id: 3,
      title: "Máy nén khí Tahico 50L",
      image: "/products/may-nen-khi-1.jpg",
      price: "4,800,000đ",
      sale: true,
    },
    {
      id: 4,
      title: "Máy nén khí Tahico 100L",
      image: "/products/may-nen-khi-2.jpg",
      price: "7,200,000đ",
      sale: true,
    },
  ],
  "cau-nang": [
    {
      id: 5,
      title: "Cầu nâng 1 trụ Tahico T-1000",
      image: "/products/cau-nang-1.jpg",
      price: "35,000,000đ",
      sale: true,
    },
    {
      id: 6,
      title: "Cầu nâng 2 trụ Tahico T-2000",
      image: "/products/cau-nang-2.jpg",
      price: "65,000,000đ",
      sale: true,
    },
  ],
  "binh-bot": [
    {
      id: 7,
      title: "Bình bọt tuyết Tahico 20L",
      image: "/products/binh-bot-1.jpg",
      price: "1,200,000đ",
      sale: true,
    },
    {
      id: 8,
      title: "Bình bọt tuyết Tahico 50L",
      image: "/products/binh-bot-2.jpg",
      price: "2,500,000đ",
      sale: true,
    },
  ],
  khac: [
    {
      id: 9,
      title: "Nước rửa xe Tahico 5L",
      image: "/products/nuoc-rua-xe-1.jpg",
      price: "150,000đ",
      sale: true,
    },
    {
      id: 10,
      title: "Dung dịch chăm sóc xe Tahico",
      image: "/products/dung-dich-1.jpg",
      price: "220,000đ",
      sale: true,
    },
  ],
}

export default function BestSellingSection() {
  return (
    <section className="py-8">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900 uppercase">MẶT HÀNG BÁN CHẠY</h2>
        </div>

        <Tabs defaultValue="may-rua-xe" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="h-auto p-1 bg-muted/50 overflow-x-auto flex-wrap">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs md:text-sm py-2 px-3">
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.entries(products).map(([key, items]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                      <div className="relative aspect-square">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                        {product.sale && (
                          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">Sale</Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-sm font-medium mb-2 line-clamp-2">{product.title}</h3>
                        <span className="text-base font-bold text-orange-500">{product.price}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
