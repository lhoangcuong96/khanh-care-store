"use client";

import orderRequestApis from "@/api-request/order";
import { locations } from "@/constants/order";
import { routePath } from "@/constants/routes";
import useCart from "@/hooks/modules/use-cart";
import { useAppContext } from "@/provider/app-provider";
import { CartType } from "@/validation-schema/cart";
import { CreateOrderBodyType } from "@/validation-schema/order";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Actions } from "./actions";
import DeliveryFormContent from "./delivery-form-content";
import OrderSummary from "./order-summary";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z
    .string()
    .optional()
    .nullable()
    .refine((value) => {
      if (!value) return true;
      return z.string().email("Email không hợp lệ").safeParse(value).success;
    }, "Email không hợp lệ"),
  fullname: z.string().trim().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  phoneNumber: z.string().refine((value) => {
    const phoneRegex = /^(\+84|0)\d{9,10}$/;
    return phoneRegex.test(value);
  }, "Số điện thoại không hợp lệ"),
  address: z.string().trim().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  province: z.string().min(1, "Tỉnh/Thành phố là bắt buộc"),
  district: z.string().min(1, "Quận/Huyện là bắt buộc"),
  ward: z.string().min(1, "Phường/Xã là bắt buộc"),
  note: z.string().optional(),
  // shippingDate: z.date().optional().nullable(),
  shippingPeriod: z.string().optional().nullable(),
  shippingFee: z.number(),
});

type FormData = z.infer<typeof formSchema>;

export default function DeliveryInformation({ cart }: { cart: CartType }) {
  const [isLoading, setIsLoading] = useState(false);

  const { account } = useAppContext();
  const { setCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: account?.email || "",
      fullname: account?.fullname || "",
      phoneNumber: account?.phoneNumber || "",
      address: account?.shippingAddress?.address || "",
      province: account?.shippingAddress?.province || locations[0].label || "",
      district:
        account?.shippingAddress?.district ||
        locations[0].districts[0].label ||
        "",
      ward: account?.shippingAddress?.ward || "",
      // shippingDate: new Date(),
      // shippingPeriod: Period.MORNING,
      note: "",
      shippingFee: 30000,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const body: CreateOrderBodyType = {
        items:
          cart?.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            variantId: item.product.variant?.id || "",
          })) || [],
        deliveryInformation: {
          recipientFullname: data.fullname,
          recipientPhoneNumber: data.phoneNumber,
          recipientEmail: data.email,
          recipientAddress: {
            address: data.address,
            ward: data.ward,
            district: data.district,
            province: data.province,
          },
          // shippingDate: data.shippingDate,
          shippingPeriod: data.shippingPeriod,
          shippingFee: data.shippingFee,
          note: data.note,
        },
      };
      const response = await orderRequestApis.createOrder(body);
      if (!response.payload) throw new Error("Có lỗi xảy ra khi tạo đơn hàng");
      const order = response.payload.data;
      router.push(
        routePath.customer.checkout.orderConfirmation(order.orderCode)
      );
      setCart({
        items: [],
        updatedAt: new Date(),
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCart(cart);
  }, [cart]);
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="grid gap-8 lg:grid-cols-3"
      >
        <div className="lg:col-span-2 ">
          <DeliveryFormContent />
        </div>
        <div className="grid gap-4">
          <OrderSummary />
          {/* <DeliveryDate /> */}
          <Actions isLoading={isLoading} />
        </div>
      </form>
    </FormProvider>
  );
}
