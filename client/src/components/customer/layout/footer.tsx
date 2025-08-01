import { Separator } from "@/components/ui/separator";
import { shopInfo } from "@/constants/shop-info";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa6";

export function Footer() {
  return (
    <div className="print:hidden bg-slate-100 w-screen pt-12 pb-6">
      <div className="max-w-7xl p-5 grid md:grid-cols-2 lg:grid-cols-[5fr_3fr_4fr_4fr] items-start m-auto gap-7">
        <div className="flex flex-col gap-5">
          <Image
            src="/images/logo.png"
            width="124"
            height="39"
            alt="logo"
          ></Image>
          <p className="text-sm font-semibold">
            Chúng tôi hi vọng tất cả người tiêu dùng Việt nam sẽ được cung cấp
            các dịch vụ, giải pháp toàn diện cho chăm sóc xe — an toàn, hiệu
            quả, và chuyên nghiệp tại KCS.
          </p>
          <h3 className="text-slate-600 font-semibold text-xl">
            Hình thức thanh toán
          </h3>
          <div className="flex flex-row gap-1">
            <Image
              src="/images/icons/payment_1.webp"
              width="50"
              height="30"
              alt="Payment method"
            ></Image>
            <Image
              src="/images/icons/payment_2.webp"
              width="50"
              height="30"
              alt="Payment method"
            ></Image>
            <Image
              src="/images/icons/payment_3.webp"
              width="50"
              height="30"
              alt="Payment method"
            ></Image>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-slatee-600 font-bold text-xl mb-5 ">
            Hình thức thanh toán
          </h3>
          {/* <Link href="#" className="font-semibold hover:text-slatee-600">
            Chính sách thành viên
          </Link> */}
          <Link href="#" className="font-semibold hover:text-slatee-600">
            Chính sách thanh toán
          </Link>
          <Link href="#" className="font-semibold hover:text-slatee-600">
            Hướng dẫn mua hàng
          </Link>
          <Link href="#" className="font-semibold hover:text-slatee-600">
            Bảo mật thông tin cá nhân
          </Link>
          <Link href="#" className="font-semibold hover:text-slatee-600">
            Quà tặng tri ân
          </Link>
        </div>
        <div>
          <div className="flex flex-col gap-2">
            <h3 className="text-slatee-600 font-bold text-xl mb-5 ">
              Thông tin chung
            </h3>
            <div className="font-semibold">
              <p className="inline-block">
                <span className="text-slate-600 mr-2">Địa chỉ:</span>
                {shopInfo.address}
              </p>
            </div>
            <div className="font-semibold">
              <p className="inline-block">
                <span className="text-slate-600 mr-2">Điện thoại:</span>
                <Link
                  href={shopInfo.phone.href}
                  className="underline text-base"
                >
                  {shopInfo.phone.label}
                </Link>
              </p>
            </div>
            <div className="font-semibold">
              <p className="inline-block">
                <span className="text-slate-600 mr-2">Email:</span>
                <a href={shopInfo.email.href} className="underline text-base">
                  {shopInfo.email.label}
                </a>
              </p>
            </div>
            <div className="font-bold mt-5">
              <h3 className="inline-block text-slatee-600 uppercase">
                Liên kết
              </h3>
              <div className="flex flex-row gap-4 mt-3">
                <Link
                  href={shopInfo.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/icons/zalo.webp"
                    width="32"
                    height="32"
                    alt="Theo dõi chúng tôi trên Zalo để cập nhật tin tức mới nhất và các sự kiện hấp dẫn"
                    title="Theo dõi chúng tôi trên Zalo để cập nhật tin tức mới nhất và các sự kiện hấp dẫn"
                  ></Image>
                </Link>
                <Link
                  href={shopInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/icons/facebook.webp"
                    width="32"
                    height="32"
                    alt="Theo dõi chúng tôi trên Facebook để cập nhật tin tức mới nhất và các sự kiện hấp dẫn"
                    title="Theo dõi chúng tôi trên Facebook để cập nhật tin tức mới nhất và các sự kiện hấp dẫn"
                  ></Image>
                </Link>
                <Link
                  href={shopInfo.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/icons/youtube.webp"
                    width="32"
                    height="32"
                    alt="Khám phá video độc đáo của chúng tôi trên Youtube."
                    title="Khám phá video độc đáo của chúng tôi trên Youtube."
                  ></Image>
                </Link>
                <Link
                  href={shopInfo.email}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/icons/google.webp"
                    width="32"
                    height="32"
                    title="Gửi câu hỏi của bạn đến chúng tôi tại địa chỉ Gmail để được tư vấn."
                    alt="Gửi câu hỏi của bạn đến chúng tôi tại địa chỉ Gmail để được tư vấn."
                  ></Image>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-2">
            <h3 className="text-slatee-600 font-bold text-xl mb-5 ">
              Instagram
            </h3>
            <div className="flex flex-row flex-wrap gap-2">
              <div className="relative group">
                <Link href="#" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/images/instagram/image_ins_1.webp"
                    alt="Khám phá hình ảnh, video độc đáo của chúng tôi trên Instagram."
                    className="w-20 h-20 object-cover rounded-md"
                    width={96}
                    height={96}
                  ></Image>
                  <div className="hidden group-hover:flex absolute top-0 left-0 w-full h-full rounded-md items-center justify-center">
                    <div className=" bg-slate-300 opacity-40 w-full h-full absolute top-0 left-0"></div>
                    <FaInstagram className="text-2xl text-white"></FaInstagram>
                  </div>
                </Link>
              </div>
              <div className="relative group">
                <Link href="#" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/images/instagram/image_ins_2.webp"
                    alt="Khám phá hình ảnh, video độc đáo của chúng tôi trên Instagram."
                    className="w-20 h-20 object-cover rounded-md"
                    width={96}
                    height={96}
                  ></Image>
                  <div className="hidden group-hover:flex absolute top-0 left-0 w-full h-full rounded-md items-center justify-center">
                    <div className=" bg-slate-300 opacity-40 w-full h-full absolute top-0 left-0"></div>
                    <FaInstagram className="text-2xl text-white"></FaInstagram>
                  </div>
                </Link>
              </div>
              <div className="relative group">
                <Link href="#" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/images/instagram/image_ins_3.webp"
                    alt="Khám phá hình ảnh, video độc đáo của chúng tôi trên Instagram."
                    className="w-20 h-20 object-cover rounded-md"
                    width={96}
                    height={96}
                  ></Image>
                  <div className="hidden group-hover:flex absolute top-0 left-0 w-full h-full rounded-md items-center justify-center">
                    <div className=" bg-slate-300 opacity-40 w-full h-full absolute top-0 left-0"></div>
                    <FaInstagram className="text-2xl text-white"></FaInstagram>
                  </div>
                </Link>
              </div>
              <div className="relative group">
                <Link href="#" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/images/instagram/image_ins_4.webp"
                    alt="Khám phá hình ảnh, video độc đáo của chúng tôi trên Instagram."
                    className="w-20 h-20 object-cover rounded-md"
                    width={96}
                    height={96}
                  ></Image>
                  <div className="hidden group-hover:flex absolute top-0 left-0 w-full h-full rounded-md items-center justify-center">
                    <div className=" bg-slate-300 opacity-40 w-full h-full absolute top-0 left-0"></div>
                    <FaInstagram className="text-2xl text-white"></FaInstagram>
                  </div>
                </Link>
              </div>
              <div className="relative group">
                <Link href="#" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/images/instagram/image_ins_5.webp"
                    alt="Khám phá hình ảnh, video độc đáo của chúng tôi trên Instagram."
                    className="w-20 h-20 object-cover rounded-md"
                    width={96}
                    height={96}
                  ></Image>
                  <div className="hidden group-hover:flex absolute top-0 left-0 w-full h-full rounded-md items-center justify-center">
                    <div className=" bg-slate-300 opacity-40 w-full h-full absolute top-0 left-0"></div>
                    <FaInstagram className="text-2xl text-white"></FaInstagram>
                  </div>
                </Link>
              </div>

              <div className="relative group">
                <Link href="#" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/images/instagram/image_ins_6.webp"
                    alt="Khám phá hình ảnh, video độc đáo của chúng tôi trên Instagram."
                    className="w-20 h-20 object-cover rounded-md"
                    width={96}
                    height={96}
                  ></Image>
                  <div className="hidden group-hover:flex absolute top-0 left-0 w-full h-full rounded-md items-center justify-center">
                    <div className=" bg-slate-300 opacity-40 w-full h-full absolute top-0 left-0"></div>
                    <FaInstagram className="text-2xl text-white"></FaInstagram>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator className="!border-slate-700"></Separator>
      <p className="text-center font-semibold">
        Bản quyền thuộc về Hoàng Mạnh Cường - lhoangcuong1996@gmail.com -
        0582134596.
      </p>
    </div>
  );
}
