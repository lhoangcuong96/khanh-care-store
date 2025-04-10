import AppBreadcrumb from "@/components/customer/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { routePath } from "@/constants/routes";
import { Apple, Leaf, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/Link";

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
            <section className="bg-lime-50 py-16">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-lime-800 mb-4">
                  Thịt Heo Ăn Chay - Vì Sức Khỏe Của Bạn
                </h2>
                <p className="text-xl text-lime-700 mb-8">
                  Thịt heo chất lượng cao từ những chú heo được nuôi bằng thực
                  phẩm thuần thực vật
                </p>
                <Link href={routePath.customer.home}>
                  <Button className="bg-lime-600 hover:bg-lime-700 text-white font-semibold py-3 px-6 rounded-full text-lg">
                    Đặt Hàng Ngay
                  </Button>
                </Link>
              </div>
            </section>

            <section className="py-16">
              <div className="container mx-auto px-4">
                <h3 className="text-3xl font-bold text-center text-lime-800 mb-12">
                  Tại Sao Chọn Heo Sạch Nhà Thoa?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <Leaf className="mx-auto h-16 w-16 text-lime-600 mb-4" />
                    <h4 className="text-xl font-semibold mb-2">
                      100% Thực Phẩm Thực Vật
                    </h4>
                    <p className="text-gray-600">
                      Heo của chúng tôi chỉ được cho ăn thức ăn từ thực vật chất
                      lượng cao
                    </p>
                  </div>
                  <div className="text-center">
                    <Apple className="mx-auto h-16 w-16 text-lime-600 mb-4" />
                    <h4 className="text-xl font-semibold mb-2">
                      Không Chất Kích Thích
                    </h4>
                    <p className="text-gray-600">
                      Tuyệt đối không sử dụng chất kích thích tăng trưởng trong
                      quá trình nuôi
                    </p>
                  </div>
                  <div className="text-center">
                    <ShieldCheck className="mx-auto h-16 w-16 text-lime-600 mb-4" />
                    <h4 className="text-xl font-semibold mb-2">
                      An Toàn Cho Sức Khỏe
                    </h4>
                    <p className="text-gray-600">
                      Thịt heo sạch, đảm bảo an toàn vệ sinh thực phẩm
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-lime-50 py-16">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0">
                    <Image
                      src="/images/vegetarian-pig.jpg"
                      alt="Heo sạch nhà Thoa"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="md:w-1/2 md:pl-8">
                    <h3 className="text-3xl font-bold text-lime-800 mb-4">
                      Về Chúng Tôi
                    </h3>
                    <p className="text-lg text-gray-700 mb-6">
                      Tại Heo sạch nhà Thoa, chúng tôi cam kết cung cấp thịt heo
                      chất lượng cao nhất cho khách hàng. Chúng tôi tin rằng
                      việc nuôi heo bằng thực phẩm thuần thực vật không chỉ tốt
                      cho sức khỏe của heo mà còn mang lại lợi ích to lớn cho
                      người tiêu dùng.
                    </p>
                    <Button className="bg-lime-600 hover:bg-lime-700 text-white py-2 px-4 rounded">
                      Tìm Hiểu Thêm
                    </Button>
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
