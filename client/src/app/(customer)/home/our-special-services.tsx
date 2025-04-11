import OutlineButton from "@/components/customer/UI/button/outline-button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function OurSpecialServices() {
  return (
    <div className="max-w-full w-screen h-fit mt-5 relative z-50 mb-10">
      <div className="flex flex-row justify-between mb-5 pb-4 border-b-[0.5px] border-b-lime-600">
        <div>
          <h3 className=" text-lime-600 text-2xl font-bold flex flex-row items-center gap-2">
            Dịch vụ đặc biệt của chúng tôi
            <Image
              src="/images/icons/leaf.webp"
              alt="icon"
              width={25}
              height={25}
            ></Image>
          </h3>
          <p className="font-semibold">
            Những dịch vụ tốt nhất dành cho khách hàng của chúng tôi
          </p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-10">
        <Card className="w-full p-5 rounded-lg relative m-1 group border-[2px]">
          <div className="flex flex-col items-center">
            <Image
              src="/images/service/dichvu_1.webp"
              alt="icon"
              width={235}
              height={178}
            ></Image>
            <p className="text-lime-600 text-xl font-bold text-center">
              Cung Cấp Thực Phẩm Sạch
            </p>
            <Separator className="!border-lime-700 border-2 !w-3 !min-w-3 group-hover:!w-8 transition-all my-4" />

            <p className="text-lg text-center font-semibold">
              Chúng tôi cam kết cung cấp thịt heo hoàn toàn sạch, được nuôi
              dưỡng trong môi trường tự nhiên và không sử dụng hóa chất độc hại.
              Mỗi sản phẩm đều được kiểm tra chất lượng nghiêm ngặt trước khi
              đến tay khách hàng, đảm bảo an toàn và dinh dưỡng cho bữa ăn của
              gia đình bạn.
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
            ></Image>
            <p className="text-lime-600 text-xl font-bold text-center">
              Giao hàng nhanh chóng
            </p>
            <Separator className="!border-lime-700 border-2 !w-3 !min-w-3 group-hover:!w-8 transition-all my-4" />

            <p className="text-lg text-center font-semibold">
              Để mang đến sự tiện lợi cho khách hàng, chúng tôi cung cấp dịch vụ
              giao hàng nhanh chóng và linh hoạt. Chỉ cần đặt hàng, đội ngũ giao
              hàng của chúng tôi sẽ đảm bảo sản phẩm được vận chuyển đến bạn
              trong thời gian sớm nhất, giữ cho thịt luôn tươi ngon và chất
              lượng.
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
            ></Image>
            <p className="text-lime-600 text-xl font-bold text-center">
              Thanh toán dễ dàng
            </p>
            <Separator className="!border-lime-700 border-2 !w-3 !min-w-3 group-hover:!w-8 transition-all my-4" />

            <p className="text-lg text-center font-semibold">
              Chúng tôi hiểu rằng việc thanh toán tiện lợi là rất quan trọng. Vì
              vậy, chúng tôi cung cấp nhiều hình thức thanh toán linh hoạt, từ
              chuyển khoản ngân hàng đến thanh toán khi nhận hàng. Khách hàng có
              thể lựa chọn phương thức phù hợp nhất với mình, giúp quá trình mua
              sắm trở nên đơn giản và nhanh chóng.
            </p>
            <OutlineButton className="mt-4">Tìm hiểu thêm</OutlineButton>
          </div>
        </Card>
      </div>
    </div>
  );
}
