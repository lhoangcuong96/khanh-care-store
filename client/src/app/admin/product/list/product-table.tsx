import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ProductInListType } from "@/validation-schema/admin/product";
import { routePath } from "@/constants/routes";
import Link from "next/link";

export function ProductTable({ products }: { products: ProductInListType }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox />
          </TableHead>
          <TableHead>Tên sản phẩm</TableHead>
          <TableHead>Doanh số</TableHead>
          <TableHead>Giá</TableHead>
          <TableHead>Kho hàng</TableHead>
          <TableHead>Sản phẩm nổi bật</TableHead>
          <TableHead>Sản phẩm bán chạy</TableHead>
          <TableHead>Thông tin khuyến mãi</TableHead>
          <TableHead>Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Image
                  src={product.image.thumbnail || ""}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="rounded-md"
                />
                <p>{product.name}</p>
                {/* <div>
                  <div>{product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    SKU: {product.sku}
                  </div>
                </div> */}
              </div>
            </TableCell>
            <TableCell>{product.sold || 0}</TableCell>
            <TableCell>{product.price.toLocaleString()}đ</TableCell>
            <TableCell>
              {product.stock ? (
                product.stock.toLocaleString()
              ) : (
                <Button variant="link" className="text-lime-600">
                  Cập nhật
                </Button>
              )}
            </TableCell>
            <TableCell>
              <Checkbox checked={product.isFeatured} />
            </TableCell>
            <TableCell>
              <Checkbox checked={product.isBestSeller} />
            </TableCell>
            <TableCell>
              {product.isPromotion ? (
                <div>
                  <div className="text-sm text-muted-foreground">
                    {product.promotionPercent}% giảm giá
                  </div>
                </div>
              ) : (
                "X"
              )}
            </TableCell>
            <TableCell className="flex flex-col gap-2">
              <Link href={routePath.admin.product.update(product.slug)}>
                <Button variant="link" className="text-lime-600">
                  Sửa sản phẩm
                </Button>
              </Link>
              {product.isPublished ? (
                <Link href="#">
                  <Button variant="link" className="text-blue-600">
                    Đẩy sản phẩm
                  </Button>
                </Link>
              ) : (
                <Link href="#">
                  <Button variant="link" className="text-orange-600">
                    Ẩn sản phẩm
                  </Button>
                </Link>
              )}
              <Link href="#">
                <Button variant="link" className="text-red-600">
                  Xoá sản phẩm
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
