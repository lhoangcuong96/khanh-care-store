import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import ContactForm from "./contact-form";
import { shopInfo } from "@/constants/shop-info";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-2">
        <div className="container max-w-[1290px] px-4 mx-auto">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Thông tin liên hệ</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative">
        <div className="w-full h-[400px] relative">
          <Image
            src="/images/lien-he.jpg"
            alt="Liên hệ "
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Liên hệ</h1>
            <p className="max-w-2xl text-lg mb-2">
              Chúng tôi luôn sẵn sàng lắng nghe và đáp ứng mọi nhu cầu của bạn.
            </p>
            <p className="max-w-2xl text-lg">
              Hãy liên hệ với Tahico ngay để nhận được sự hỗ trợ tốt nhất cho
              doanh nghiệp và dự án của bạn.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container max-w-[1290px] px-4 mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">
              Đăng ký tư vấn
            </h2>
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">
                    Trụ sở chính
                  </h3>
                  <p className="text-gray-700">{shopInfo.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">
                    Email
                  </h3>
                  <Link href={`mailto:${shopInfo.email}`} className="underline">
                    {shopInfo.email}
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">
                    Hotline
                  </h3>
                  <Link href={`tel:${shopInfo.phone}`} className="underline">
                    {shopInfo.phone}
                  </Link>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="w-full h-80 bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d244.81363792586882!2d106.86128320947408!3d10.961997041873225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1zaGVvIHPhuqFjaCBuaMOgIHRob2E!5e0!3m2!1sen!2s!4v1738342468103!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              ;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
