import OutlineButton from "@/components/customer/UI/button/outline-button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function OurSpecialServices() {
  return (
    <div className="max-w-full w-screen h-fit mt-5 relative z-50 mb-10">
      <div className="flex flex-row justify-between mb-5 pb-4 border-b-[0.5px] border-b-slate-600 gap-4">
        <div>
          <h3 className=" text-slate-600 text-2xl font-bold flex flex-row items-center gap-2">
            ✨ Dịch vụ đặc biệt của chúng tôi 🚗
          </h3>
          <p className="font-semibold">
            Những giải pháp tối ưu dành cho xe của bạn
          </p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-10">
        <Card className="w-full p-5 rounded-lg relative m-1 group border-[2px]">
          <div className="flex flex-col items-center">
            <Image
              src="/images/service/dichvu_1.png"
              alt="icon"
              width={235}
              height={178}
              className="rounded-lg w-[235px] h-[178px] object-cover mb-7"
            ></Image>
            <p className="text-slatee-600 text-xl font-bold text-center">
              🧼 Cung Cấp Dung Dịch & Dụng Cụ Chăm Sóc Xe
            </p>
            <Separator className="!border-slate-700 border-2 !w-3 !min-w-3 group-hover:!w-8 transition-all my-4" />

            <p className="text-lg text-center font-semibold">
              Chúng tôi cung cấp đa dạng các loại dung dịch làm sạch, đánh bóng,
              dưỡng nội thất và chăm sóc ngoại thất đến từ những thương hiệu uy
              tín. Bên cạnh đó, bạn còn tìm thấy đầy đủ dụng cụ hỗ trợ như khăn
              microfiber, máy rửa xe, vòi phun, và nhiều sản phẩm chuyên dụng
              khác, giúp bạn chăm sóc xe một cách toàn diện và hiệu quả.
            </p>
            <OutlineButton className="mt-4">Tìm hiểu thêm</OutlineButton>
          </div>
        </Card>
        <Card className="w-full p-5 rounded-lg relative m-1 gap-1 group">
          <div className="flex flex-col items-center">
            <Image
              src="/images/service/dichvu_2.webp"
              alt="icon"
              width={235}
              height={178}
              className="rounded-lg w-[235px] h-[178px] object-cover mb-7"
            ></Image>
            <p className="text-slatee-600 text-xl font-bold text-center">
              🚚 Giao hàng nhanh chóng
            </p>
            <Separator className="!border-slate-700 border-2 !w-3 !min-w-3 group-hover:!w-8 transition-all my-4" />

            <p className="text-lg text-center font-semibold">
              Chúng tôi hiểu rằng sự tiện lợi là yếu tố quan trọng. Hệ thống
              giao hàng linh hoạt giúp đơn hàng của bạn được xử lý và vận chuyển
              nhanh chóng trên toàn quốc. Sản phẩm luôn được đóng gói cẩn thận
              để đảm bảo nguyên vẹn và sẵn sàng sử dụng ngay khi đến tay khách
              hàng.
            </p>
            <OutlineButton className="mt-4">Tìm hiểu thêm</OutlineButton>
          </div>
        </Card>
        <Card className="w-full p-5 rounded-lg relative m-1 gap-1 group">
          <div className="flex flex-col items-center">
            <Image
              src="/images/service/dichvu_3.webp"
              alt="icon"
              width={235}
              height={178}
              className="rounded-lg w-[235px] h-[178px] object-cover mb-7"
            ></Image>
            <p className="text-slatee-600 text-xl font-bold text-center">
              💳 Thanh toán dễ dàng
            </p>
            <Separator className="!border-slate-700 border-2 !w-3 !min-w-3 group-hover:!w-8 transition-all my-4" />

            <p className="text-lg text-center font-semibold">
              Chúng tôi hỗ trợ nhiều phương thức thanh toán hiện đại và an toàn
              như chuyển khoản ngân hàng, ví điện tử và thanh toán khi nhận
              hàng. Quá trình thanh toán nhanh chóng, minh bạch và thuận tiện
              giúp bạn tiết kiệm thời gian khi mua sắm trực tuyến.
            </p>
            <OutlineButton className="mt-4">Tìm hiểu thêm</OutlineButton>
          </div>
        </Card>
      </div>
    </div>
  );
}
