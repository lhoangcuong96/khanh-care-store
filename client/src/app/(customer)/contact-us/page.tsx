import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AppBreadcrumb from "@/components/customer/layout/breadcrumb";
import { routePath } from "@/constants/routes";
import { shopInfo } from "@/constants/shop-info";
import Image from "next/image";

export async function generateMetadata() {
  return {
    title: "Liên hệ với chung tôi",
    description: "Liên hệ với Heo sạch nhà Thoa để được hỗ trợ tốt nhất.",
  };
}

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full items-center justify-center h-full text-sm font-medium">
      <AppBreadcrumb
        pageTitle={"Liên hệ với chúng tôi"}
        breadcrumbItems={[
          {
            title: "Trang chủ",
            href: routePath.customer.home,
          },
          {
            title: "Liên hệ",
          },
        ]}
      ></AppBreadcrumb>
      <div className="w-screen p-8 flex items-center justify-center h-full">
        <div className="container mx-auto p-4 grid gap-6 md:grid-cols-2 lg:gap-12 py-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-slate-100 p-6 rounded-lg">
              <h2 className="text-slate-700 text-2xl font-semibold mb-6 flex items-center gap-2">
                Cửa hàng
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-700 p-2 rounded-full">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Địa chỉ</h3>
                    <p className="text-gray-600">{shopInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-slate-700 p-2 rounded-full">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Thời gian làm việc</h3>
                    <p className="text-gray-600">3 giờ sáng - 13 giờ trưa</p>
                    <p className="text-gray-600">Từ thứ 2 đến chủ nhật</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-slate-700 p-2 rounded-full">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Hotline</h3>
                    <p className="text-gray-600">{shopInfo.phone.label}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-slate-700 p-2 rounded-full">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">{shopInfo.email.label}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-slate-100 p-6 rounded-lg">
              <h2 className="text-slate-700 text-2xl font-semibold mb-6 flex items-center gap-2">
                Liên hệ với chúng tôi
                <Image
                  src="/images/logo.png"
                  alt="logo"
                  width={100}
                  height={100}
                />
              </h2>

              <p className="text-gray-600 mb-6">
                Nếu bạn có thắc mắc gì, có thể gửi yêu cầu cho chúng tôi, và
                chúng tôi sẽ liên lạc lại với bạn sớm nhất có thể.
              </p>

              <form className="space-y-4">
                <Input placeholder="Họ và tên" className="bg-white" />
                <Input type="email" placeholder="Email" className="bg-white" />
                <Input placeholder="Điện thoại" className="bg-white" />
                <Textarea
                  placeholder="Nội dung"
                  className="bg-white min-h-[120px]"
                />
                <Button className="bg-slate-700 hover:bg-slate-600 text-white w-full md:w-auto">
                  Gửi thông tin
                </Button>
              </form>
            </div>
          </div>

          {/* Map */}
          <div className="h-[600px] rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d244.81363792586882!2d106.86128320947408!3d10.961997041873225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1zaGVvIHPhuqFjaCBuaMOgIHRob2E!5e0!3m2!1sen!2s!4v1738342468103!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
