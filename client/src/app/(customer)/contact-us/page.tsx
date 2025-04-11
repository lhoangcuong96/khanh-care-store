import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AppBreadcrumb from "@/components/customer/layout/breadcrumb";
import { routePath } from "@/constants/routes";

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
            <div className="bg-[#f8ffed] p-6 rounded-lg">
              <h2 className="text-[#588c1d] text-2xl font-semibold mb-6 flex items-center gap-2">
                Cửa hàng heo sạch nhà Thoa
                <span className="inline-block w-5 h-5">🌿</span>
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-[#588c1d] p-2 rounded-full">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Địa chỉ</h3>
                    <p className="text-gray-600">
                      Tân Hiệp, Biên Hoà, Đồng Nai
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#588c1d] p-2 rounded-full">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Thời gian làm việc</h3>
                    <p className="text-gray-600">3 giờ sáng - 13 giờ trưa</p>
                    <p className="text-gray-600">Từ thứ 2 đến chủ nhật</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#588c1d] p-2 rounded-full">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Hotline</h3>
                    <p className="text-gray-600">0975209429</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#588c1d] p-2 rounded-full">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">lhoangcuong1996@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#f8ffed] p-6 rounded-lg">
              <h2 className="text-[#588c1d] text-2xl font-semibold mb-6 flex items-center gap-2">
                Liên hệ với chúng tôi
                <span className="inline-block w-5 h-5">🌿</span>
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
                <Button className="bg-[#588c1d] hover:bg-[#466f17] text-white w-full md:w-auto">
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
