import AppBreadcrumb from "@/components/customer/layout/breadcrumb";
import { routePath } from "@/constants/routes";
import { shopInfo } from "@/constants/shop-info";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description: "Chính sách bảo mật cho ứng dụng",
};

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col w-full items-center justify-center h-full text-sm font-medium">
      <AppBreadcrumb
        pageTitle={"Chính sách bảo mật"}
        breadcrumbItems={[
          {
            title: "Trang chủ",
            href: routePath.customer.home,
          },
          {
            title: "Chính sách bảo mật",
          },
        ]}
      />

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            1. Thông tin chúng tôi thu thập
          </h2>
          <p className="mb-4">
            Khi bạn sử dụng ứng dụng của chúng tôi, chúng tôi có thể thu thập
            các thông tin sau:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Thông tin bạn cung cấp khi tạo tài khoản</li>
            <li>
              Thông tin từ Facebook khi bạn đăng nhập bằng Facebook (bao gồm địa
              chỉ email và thông tin hồ sơ công khai)
            </li>
            <li>Dữ liệu sử dụng và phân tích</li>
            <li>Thông tin thiết bị và trình duyệt</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            2. Đăng nhập bằng Facebook
          </h2>
          <p className="mb-4">
            Khi bạn chọn đăng nhập bằng Facebook, chúng tôi thu thập:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Địa chỉ email Facebook của bạn</li>
            <li>Thông tin hồ sơ công khai của bạn</li>
            <li>Token xác thực để duy trì phiên đăng nhập của bạn</li>
          </ul>
          <p className="mt-4">Chúng tôi sử dụng thông tin này để:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Tạo và quản lý tài khoản của bạn</li>
            <li>Cung cấp cho bạn quyền truy cập vào dịch vụ của chúng tôi</li>
            <li>Liên lạc với bạn về dịch vụ của chúng tôi</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            3. Cách chúng tôi sử dụng thông tin của bạn
          </h2>
          <p className="mb-4">Chúng tôi sử dụng thông tin đã thu thập để:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Cung cấp và duy trì dịch vụ của chúng tôi</li>
            <li>Cải thiện và cá nhân hóa trải nghiệm của bạn</li>
            <li>Liên lạc với bạn về các cập nhật và thay đổi</li>
            <li>Đảm bảo an toàn cho dịch vụ của chúng tôi</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Bảo mật dữ liệu</h2>
          <p className="mb-4">
            Chúng tôi áp dụng các biện pháp bảo mật phù hợp để bảo vệ thông tin
            cá nhân của bạn. Tuy nhiên, không có phương thức truyền tải nào qua
            internet là an toàn 100%, và chúng tôi không thể đảm bảo an toàn
            tuyệt đối.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Quyền của bạn</h2>
          <p className="mb-4">Bạn có quyền:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Truy cập thông tin cá nhân của bạn</li>
            <li>Sửa thông tin không chính xác</li>
            <li>Yêu cầu xóa thông tin của bạn</li>
            <li>Từ chối một số hoạt động thu thập dữ liệu</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            6. Liên hệ với chúng tôi
          </h2>
          <p className="mb-4">
            Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật này, vui lòng
            liên hệ với chúng tôi tại:
          </p>
          <p className="font-medium">
            Email:{" "}
            <Link
              href={shopInfo.email.href}
              className="text-blue-500 underline"
            >
              {shopInfo.email.label}
            </Link>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            7. Cập nhật chính sách
          </h2>
          <p className="mb-4">
            Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian.
            Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi nào bằng cách đăng
            Chính sách bảo mật mới trên trang này và cập nhật ngày &quot;Cập
            nhật lần cuối&quot;.
          </p>
          <p className="text-sm text-gray-600">
            Cập nhật lần cuối: {new Date().toLocaleDateString()}
          </p>
        </section>
      </div>
    </div>
  );
}
