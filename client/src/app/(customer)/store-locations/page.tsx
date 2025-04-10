import AppBreadcrumb from "@/components/customer/layout/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { routePath } from "@/constants/routes";
import { Clock, MapPin, Phone, Store, Users } from "lucide-react";

export async function generateMetadata() {
  return {
    title: "Hệ thống cửa hàng",
    description: "Hệ thống cửa hàng của Heo sạch nhà Thoa",
  };
}

export default function StoreLocations() {
  return (
    <div className="flex flex-col w-full items-center justify-center h-full text-sm font-medium">
      <AppBreadcrumb
        pageTitle="Hệ thống cửa hàng"
        breadcrumbItems={[
          {
            title: "Trang chủ",
            href: routePath.customer.home,
          },
          {
            title: "Hệ thống cửa hàng",
          },
        ]}
      ></AppBreadcrumb>
      <div className="w-screen p-8 flex items-center justify-center h-full">
        <div className="max-w-7xl flex flex-col min-h-screen">
          <div className="min-h-screen bg-white">
            {/* Top Features Banner */}
            <div className="border-b">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#75A644] p-3 rounded-full">
                      <Store className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Chỉ một hệ thống</p>
                      <p className="text-sm text-gray-600">Trên toàn quốc</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#75A644] p-3 rounded-full">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Nhân viên niềm nở</p>
                      <p className="text-sm text-gray-600">
                        Để phục vụ quý khách
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#75A644] p-3 rounded-full">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Mở cửa 8-22h</p>
                      <p className="text-sm text-gray-600">cả CN & Lễ tết</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Store Locations */}
                <div>
                  <div className="flex gap-4 mb-6">
                    <Select>
                      <SelectTrigger className="w-[200px] bg-[#75A644] text-white">
                        <SelectValue placeholder="Chọn tỉnh thành" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hcm">Hồ Chí Minh</SelectItem>
                        <SelectItem value="hanoi">Hà Nội</SelectItem>
                        <SelectItem value="cantho">Cần Thơ</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[200px] border-[#75A644] text-[#75A644]">
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="q1">Quận 1</SelectItem>
                        <SelectItem value="q2">Quận 2</SelectItem>
                        <SelectItem value="q3">Quận 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Store Cards */}
                  <div className="space-y-4">
                    <StoreCard
                      name="Heo nhà Thoa - Đồng Nai"
                      address="152 A7/1 Phạm Văn Khoai P.Tân Hiệp Biên Hoà Đồng Nai - Đối diên cổng A sân banh Đồng Nai"
                      hotline="0975209429"
                    />
                  </div>
                </div>

                {/* Right Column - Map */}
                <div className="h-[600px] bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d292.947431575845!2d106.8612929989538!3d10.962136151606753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2s!4v1738397499502!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoreCard({
  name,
  address,
  hotline,
}: {
  name: string;
  address: string;
  hotline: string;
}) {
  return (
    <div className="p-4 border border-[#75A644] rounded-lg">
      <h3 className="text-lg font-semibold text-[#75A644] mb-2">{name}</h3>
      <div className="flex gap-2 items-start mb-2">
        <MapPin className="h-5 w-5 text-[#75A644] shrink-0 mt-1" />
        <div>
          <p className="font-semibold">Địa chỉ:</p>
          <p className="text-gray-600">{address}</p>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Phone className="h-5 w-5 text-[#75A644]" />
        <div>
          <p className="font-semibold">Hotline:</p>
          <p className="text-gray-600">{hotline}</p>
        </div>
      </div>
    </div>
  );
}
