import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProductTabs({ description }: { description?: string | null }) {
  return (
    <div className="mt-8">
      <Tabs defaultValue="description">
        <TabsList>
          <TabsTrigger value="description">MÔ TẢ SẢN PHẨM</TabsTrigger>
          <TabsTrigger value="guide">HƯỚNG DẪN MUA HÀNG</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4">
          <div className="prose max-w-none leading-loose border border-lime-600 p-3 rounded-lg text-sm">
            {description && (
              <div dangerouslySetInnerHTML={{ __html: description }}></div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="guide">
          <div className="prose max-w-none leading-loose border border-lime-600 p-3 rounded-lg text-sm">
            <p>
              <strong>Bước 1:</strong> Truy cập website và lựa chọn sản phẩm cần
              mua.
            </p>

            <p>
              <strong>Bước 2:</strong> Click vào sản phẩm muốn mua, màn hình
              hiển thị ra pop up với các lựa chọn sau:
            </p>
            <ul>
              <li>
                Nếu bạn muốn tiếp tục mua hàng: Bấm vào phần tiếp tục mua hàng
                để lựa chọn thêm sản phẩm vào giỏ hàng.
              </li>
              <li>
                Nếu bạn muốn xem giỏ hàng để cập nhật sản phẩm: Bấm vào xem giỏ
                hàng.
              </li>
              <li>
                Nếu bạn muốn đặt hàng và thanh toán cho sản phẩm này, vui lòng
                bấm vào: Đặt hàng và thanh toán.
              </li>
            </ul>

            <p>
              <strong>Bước 3:</strong> Lựa chọn thông tin tài khoản thanh toán.
            </p>
            <ul>
              <li>
                Nếu bạn đã có tài khoản, vui lòng nhập thông tin tên đăng nhập
                là email và mật khẩu vào mục đã có tài khoản trên hệ thống.
              </li>
              <li>
                Nếu bạn chưa có tài khoản và muốn đăng ký tài khoản, vui lòng
                điền các thông tin cá nhân để tiếp tục đăng ký tài khoản. Khi có
                tài khoản, bạn sẽ dễ dàng theo dõi được đơn hàng của mình.
              </li>
              <li>
                Nếu bạn muốn mua hàng mà không cần tài khoản, vui lòng nhấp
                chuột vào mục đặt hàng không cần tài khoản.
              </li>
            </ul>

            <p>
              <strong>Bước 4:</strong> Điền các thông tin của bạn để nhận đơn
              hàng, lựa chọn hình thức thanh toán và vận chuyển cho đơn hàng của
              mình.
            </p>

            <p>
              <strong>Bước 5:</strong> Xem lại thông tin đặt hàng, điền chú
              thích và gửi đơn hàng.
            </p>

            <p>
              Sau khi nhận được đơn hàng bạn gửi, chúng tôi sẽ liên hệ bằng cách
              gọi điện lại để xác nhận lại đơn hàng và địa chỉ của bạn.
            </p>

            <p>Trân trọng cảm ơn.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
