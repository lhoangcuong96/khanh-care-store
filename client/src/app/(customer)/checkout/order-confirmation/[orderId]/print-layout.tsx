import { OrderType } from "@/validation-schema/order";
import Image from "next/image";

export default function PrintLayout({
  orderDetails,
}: {
  orderDetails: OrderType;
}) {
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()}₫`;
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const deliveryInformation = orderDetails?.deliveryInformation;
  const recipientAddress = deliveryInformation?.recipientAddress;

  return (
    <div className="hidden print:block p-8 max-w-[21cm] mx-auto text-black">
      {/* Header */}
      <div className="flex justify-between text-sm mb-4">
        <div>{getCurrentDateTime()}</div>
        <div>Heo sạch nhà Thoa - Cảm ơn</div>
      </div>

      {/* Logo */}
      <div className="text-center mb-8">
        <Image
          src="/images/logo-3.jpeg"
          alt="Dola Organic Logo"
          width={200}
          height={60}
          className="mx-auto"
        />
      </div>

      {/* Confirmation Message */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-medium mb-2">Cảm ơn bạn đã đặt hàng</h1>
        <p className="text-sm">
          Một email xác nhận đã được gửi tới{" "}
          {deliveryInformation.recipientEmail}.<br />
          Xin vui lòng kiểm tra email của bạn
        </p>
      </div>

      {/* Order Details */}
      <div className="border rounded-md mb-8">
        <div className="p-4 border-b">
          <h2 className="font-medium">Đơn hàng #{orderDetails.orderCode}</h2>
        </div>

        {/* Products */}
        {orderDetails.items.map((item, index) => (
          <div
            key={index}
            className="p-4 border-b flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div>
                <div className="font-medium">{item.productName}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">x {item.productQuantity}</div>
              <div className="w-24 text-right">
                {formatPrice(item.productPrice)}
              </div>
            </div>
          </div>
        ))}

        {/* Totals */}
        <div className="p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tạm tính</span>
            <span>{formatPrice(orderDetails.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Phí vận chuyển</span>
            <span>{formatPrice(deliveryInformation.shippingFee)}</span>
          </div>
          <div className="flex justify-between font-medium pt-2 border-t">
            <span>Tổng cộng</span>
            <span>{formatPrice(orderDetails.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="border rounded-md p-4 mb-8">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-4">Thông tin mua hàng</h3>
            <div className="space-y-2 text-sm">
              <p>{deliveryInformation?.recipientFullname}</p>
              <p>{deliveryInformation?.recipientEmail}</p>
              <p>{deliveryInformation?.recipientPhoneNumber}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-4">Địa chỉ nhận hàng</h3>
            <div className="space-y-2 text-sm">
              <p>{deliveryInformation?.recipientFullname}</p>
              <p>{recipientAddress?.address}</p>
              <p>{`${recipientAddress?.ward}, ${recipientAddress?.district}, ${recipientAddress?.province}`}</p>
              <p>{deliveryInformation?.recipientPhoneNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment and Shipping Method */}
      <div className="border rounded-md p-4 mb-8">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-4">Phương thức thanh toán</h3>
            <p className="text-sm">Thanh toán khi giao hàng (COD)</p>
          </div>
          <div>
            <h3 className="font-medium mb-4">Phương thức vận chuyển</h3>
            <p className="text-sm">Giao hàng tận nơi</p>
          </div>
        </div>
      </div>
    </div>
  );
}
