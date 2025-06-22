import AppBreadcrumb from "@/components/customer/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { routePath } from "@/constants/routes";
import { Car, ShieldCheck, Wrench, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata() {
  return {
    title: "Giới thiệu về KCareStore",
    description: `KCareStore - Giải pháp toàn diện cho ngành rửa xe chuyên nghiệp tại Việt Nam.`,
  };
}

export default function AboutUsPage() {
  return (
    <div className="flex flex-col w-full items-center justify-center h-full text-sm font-medium">
      <AppBreadcrumb
        pageTitle="Giới thiệu"
        breadcrumbItems={[
          {
            title: "Trang chủ",
            href: routePath.customer.home,
          },
          {
            title: "Giới thiệu",
          },
        ]}
      ></AppBreadcrumb>
      <div className="w-screen p-8 flex items-center justify-center h-full">
        <div className="max-w-7xl flex flex-col min-h-screen">
          <main className="flex-grow">
            <section className="bg-slate-50 py-16">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  KCareStore – Giải pháp toàn diện cho ngành rửa xe chuyên
                  nghiệp
                </h2>
                <p className="text-xl text-slate-700 mb-8">
                  Đơn vị tiên phong cung cấp dung dịch bọt tuyết, thiết bị và
                  dụng cụ chuyên dụng phục vụ cho ngành chăm sóc và rửa xe ô tô
                  – xe máy
                </p>
                <Link href={routePath.customer.products()}>
                  <Button className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-full text-lg">
                    Xem Sản Phẩm
                  </Button>
                </Link>
              </div>
            </section>

            <section className="py-16">
              <div className="container mx-auto px-4">
                <h3 className="text-3xl font-bold text-center text-slate-800 mb-12">
                  Sản phẩm và dịch vụ nổi bật
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <Car className="mx-auto h-16 w-16 text-slate-600 mb-4" />
                    <h4 className="text-xl font-semibold mb-2">
                      Dung dịch bọt tuyết rửa xe cao cấp
                    </h4>
                    <p className="text-gray-600">
                      Tạo bọt dày, làm sạch sâu và dễ dàng rửa trôi bụi bẩn, bảo
                      vệ lớp sơn và an toàn với môi trường
                    </p>
                  </div>
                  <div className="text-center">
                    <Wrench className="mx-auto h-16 w-16 text-slate-600 mb-4" />
                    <h4 className="text-xl font-semibold mb-2">
                      Máy móc và thiết bị rửa xe cao áp
                    </h4>
                    <p className="text-gray-600">
                      Máy xịt rửa áp lực cao, súng xịt, béc xịt nhập khẩu chính
                      hãng từ Italia và các quốc gia uy tín
                    </p>
                  </div>
                  <div className="text-center">
                    <Award className="mx-auto h-16 w-16 text-slate-600 mb-4" />
                    <h4 className="text-xl font-semibold mb-2">
                      Dụng cụ và phụ kiện hỗ trợ chuyên nghiệp
                    </h4>
                    <p className="text-gray-600">
                      Khăn lau chuyên dụng, bàn chải, bình phun bọt tuyết, thùng
                      lọc bùn và nhiều sản phẩm khác
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-slate-50 py-16">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0">
                    <Image
                      src="/images/banner.webp"
                      alt="KCareStore - Giải pháp rửa xe chuyên nghiệp"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="md:w-1/2 md:pl-8">
                    <h3 className="text-3xl font-bold text-slate-800 mb-4">
                      Vì sao chọn KCareStore?
                    </h3>
                    <div className="space-y-4 text-lg text-gray-700 mb-6">
                      <div className="flex items-start">
                        <ShieldCheck className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                        <p>
                          <strong>Kinh nghiệm thực tế:</strong> Với nhiều năm
                          hoạt động trong ngành, chúng tôi hiểu rõ nhu cầu và
                          thách thức của các đơn vị rửa xe tại Việt Nam.
                        </p>
                      </div>
                      <div className="flex items-start">
                        <ShieldCheck className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                        <p>
                          <strong>Chất lượng đảm bảo:</strong> Toàn bộ sản phẩm
                          đều được chọn lọc kỹ lưỡng, có nguồn gốc rõ ràng và
                          được kiểm định về chất lượng.
                        </p>
                      </div>
                      <div className="flex items-start">
                        <ShieldCheck className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                        <p>
                          <strong>Giá cả cạnh tranh:</strong> Cam kết mang đến
                          giải pháp tối ưu với chi phí hợp lý, phù hợp với mọi
                          quy mô kinh doanh.
                        </p>
                      </div>
                      <div className="flex items-start">
                        <ShieldCheck className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                        <p>
                          <strong>Hỗ trợ tận tâm:</strong> Đội ngũ tư vấn giàu
                          kinh nghiệm luôn sẵn sàng hỗ trợ kỹ thuật và tư vấn
                          giải pháp.
                        </p>
                      </div>
                    </div>
                    <p className="text-lg text-gray-700 mb-6">
                      Chúng tôi tin rằng sự phát triển bền vững của bạn chính là
                      thành công của KCareStore. Hãy để chúng tôi đồng hành cùng
                      bạn trên hành trình chuyên nghiệp hóa dịch vụ chăm sóc xe.
                    </p>
                    <p className="text-lg font-semibold text-slate-800 mb-4">
                      KCareStore – Sạch từng chi tiết, chuyên nghiệp từng bước.
                    </p>
                    <Link href={routePath.customer.contact}>
                      <Button className="bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded">
                        Liên Hệ Ngay
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
