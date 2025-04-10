import { Card } from "@/components/ui/card";
import { Truck, RefreshCw, HeadphonesIcon, Package } from "lucide-react";

export function StorePolicies() {
  return (
    <Card className="bg-[#f3fce8] p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        Chính sách cửa hàng
        <span className="text-lime-600">🍃</span>
      </h3>
      <div className="space-y-4">
        <PolicyItem
          icon={<Truck className="w-5 h-5 text-lime-600" />}
          title="Miễn phí vận chuyển"
          description="Cho tất cả đơn hàng trong phường Tân Hiệp thành phố Biên Hòa tỉnh Đồng Nai"
        />
        <PolicyItem
          icon={<RefreshCw className="w-5 h-5 text-lime-600" />}
          title="Miễn phí đổi - trả"
          description="Đối với sản phẩm lỗi sản xuất hoặc vận chuyển"
        />
        <PolicyItem
          icon={<HeadphonesIcon className="w-5 h-5 text-lime-600" />}
          title="Hỗ trợ nhanh chóng"
          description="Gọi Hotline: 0975209429 để được hỗ trợ ngay"
        />
        <PolicyItem
          icon={<Package className="w-5 h-5 text-lime-600" />}
          title="Ưu đãi combo"
          description="Mua theo combo,mua càng mua nhiều giá càng rẻ"
        />
      </div>
    </Card>
  );
}

interface PolicyItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function PolicyItem({ icon, title, description }: PolicyItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
