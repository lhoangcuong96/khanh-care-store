import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

interface PromotionCode {
  code: string;
  description: string;
  expiry: string;
}

const promotionCodes: PromotionCode[] = [
  {
    code: "DOLA10",
    description: "Giảm 10.000đ giá trị đơn hàng",
    expiry: "HSD: 1/10/2023",
  },
  {
    code: "FREESHIP",
    description: "Miễn phí vận chuyển",
    expiry: "HSD: Không thời hạn",
  },
  {
    code: "DOLA20",
    description: "Giảm 20% giá trị đơn hàng",
    expiry: "HSD: 1/10/2023",
  },
  {
    code: "DOLA50K",
    description: "Giảm 50k",
    expiry: "HSD: 1/10/2023",
  },
];

export function PromotionCodes() {
  return (
    <Card className="bg-[#f3fce8] p-4 mt-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        Mã khuyến mãi
        <span className="text-lime-600">🍃</span>
      </h3>
      <div className="space-y-3">
        {promotionCodes.map((promo) => (
          <Card key={promo.code} className="p-3 border-lime-600">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{promo.code}</span>
                  <InfoIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {promo.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {promo.expiry}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-lime-600 text-white hover:bg-[#6f9e32] border-0"
              >
                Sao chép
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
