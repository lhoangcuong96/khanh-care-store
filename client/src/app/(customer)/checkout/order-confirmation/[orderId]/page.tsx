import AppBreadcrumb from "@/components/customer/layout/breadcrumb";
import { routePath } from "@/constants/routes";

import orderRequestApis from "@/api-request/order";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Actions from "./actions";
import PrintLayout from "./print-layout";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  let errorMessage = "";
  let orderDetails = null;
  try {
    const { orderId } = await params;
    if (!orderId) {
      errorMessage = "Không tìm thấy đơn hàng";
    }
    const response = await orderRequestApis.getOrder(orderId);
    if (!response.payload?.data) {
      errorMessage = "Không tìm thấy đơn hàng";
    } else {
      orderDetails = response.payload.data;
    }
  } catch (error) {
    errorMessage = "Có lỗi xảy ra khi tải dữ liệu";
    console.error(error);
  }

  const deliveryInformation = orderDetails?.deliveryInformation;
  const recipientAddress = deliveryInformation?.recipientAddress;

  return (
    <>
      <div className="print:hidden flex flex-col w-full items-center justify-center h-full text-sm font-medium">
        <AppBreadcrumb
          pageTitle="Giỏ hàng"
          breadcrumbItems={[
            {
              title: "Trang chủ",
              href: routePath.customer.home,
            },
            {
              title: "Giỏ hàng",
            },
          ]}
        ></AppBreadcrumb>
        <div className="w-screen p-8 flex items-center justify-center h-full">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            {errorMessage ? (
              <div className="text-center text-red-500">{errorMessage}</div>
            ) : (
              <div className="bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                  <div className="mb-8">
                    <Image
                      src="/images/logo-3.jpeg"
                      alt="Dola Organic Logo"
                      width={128}
                      height={128}
                      className="mx-auto"
                    />
                  </div>

                  <div className="max-w-4xl mx-auto">
                    {/* Success Message */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h1 className="text-xl font-semibold">
                          Cảm ơn bạn đã đặt hàng
                        </h1>
                        {deliveryInformation?.recipientEmail && (
                          <p className="text-gray-600">
                            Một email xác nhận đã được gửi tới{" "}
                            <span className="font-bold underline">
                              {deliveryInformation?.recipientEmail}
                            </span>
                            <br />
                            Xin vui lòng kiểm tra email của bạn
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                      {/* Order Details - Left Column */}
                      <div className="md:col-span-2">
                        <Card className="p-6">
                          <div className="grid md:grid-cols-2 gap-8">
                            {/* Customer Information */}
                            <div>
                              <h2 className="font-semibold text-lg mb-4">
                                Thông tin mua hàng
                              </h2>
                              <div className="space-y-2 text-gray-600">
                                <p>{deliveryInformation?.recipientFullname}</p>
                                <p>{deliveryInformation?.recipientEmail}</p>
                                <p>
                                  {deliveryInformation?.recipientPhoneNumber}
                                </p>
                              </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                              <h2 className="font-semibold text-lg mb-4">
                                Địa chỉ nhận hàng
                              </h2>
                              <div className="space-y-2 text-gray-600">
                                <p>{deliveryInformation?.recipientFullname}</p>
                                <p>{recipientAddress?.address}</p>
                                <p>{`${recipientAddress?.ward}, ${recipientAddress?.district}, ${recipientAddress?.province}`}</p>
                                <p>
                                  {deliveryInformation?.recipientPhoneNumber}
                                </p>
                              </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                              <h2 className="font-semibold text-lg mb-4">
                                Phương thức thanh toán
                              </h2>
                              <p className="text-gray-600">
                                Thanh toán khi giao hàng (COD)
                              </p>
                            </div>

                            {/* Shipping Method */}
                            <div>
                              <h2 className="font-semibold text-lg mb-4">
                                Phương thức vận chuyển
                              </h2>
                              <p className="text-gray-600">Giao hàng tận nơi</p>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Order Summary - Right Column */}
                      <div>
                        <Card className="p-6">
                          <h2 className="font-semibold text-lg mb-4">
                            Đơn hàng #1034 (1)
                          </h2>

                          <div className="border-b pb-4 mb-4">
                            {orderDetails?.items.map((item) => (
                              <div
                                className="flex items-start gap-4"
                                key={item.productId}
                              >
                                <div className="relative w-20 h-20">
                                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                                    {item.productQuantity}
                                  </div>
                                  <Image
                                    src={item.productImage}
                                    alt={item.productName}
                                    width={80}
                                    height={80}
                                    className="rounded-md"
                                  />
                                </div>

                                <div className="flex-1">
                                  <h3 className="font-medium">
                                    {item.productName}
                                  </h3>
                                  <p className="mt-1">
                                    {item.productPrice.toLocaleString()}đ
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tạm tính</span>
                              <span>
                                {orderDetails?.subtotal.toLocaleString()}đ
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Phí vận chuyển
                              </span>
                              <span>
                                {deliveryInformation?.shippingFee.toLocaleString()}
                                đ
                              </span>
                            </div>
                            <div className="flex justify-between font-semibold pt-2 border-t">
                              <span>Tổng cộng</span>
                              <span className="text-blue-600">
                                {orderDetails?.totalAmount.toLocaleString()}đ
                              </span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                      <Actions></Actions>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {orderDetails && <PrintLayout orderDetails={orderDetails} />}
    </>
  );
}
