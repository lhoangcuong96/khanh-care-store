"use client";

import AdminDebtManagementRequestApis from "@/api-request/admin/debt-management";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  transactionPaymentMethodOptions,
  TransactionStatus,
  transactionStatusOptions,
  TransactionType,
  transactionTypeOptions,
} from "@/constants/debt";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { InfoIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

// Định nghĩa schema cho sản phẩm
const productItemSchema = z.object({
  productName: z.string().min(1, { message: "Vui lòng nhập tên sản phẩm" }),
  quantity: z
    .string()
    .min(1, { message: "Vui lòng nhập số lượng" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Số lượng không hợp lệ",
    })
    .refine((val) => Number(val) > 0, {
      message: "Số lượng phải lớn hơn 0",
    }),
  price: z
    .string()
    .min(1, { message: "Vui lòng nhập đơn giá" })
    .refine((val) => !isNaN(Number(val.replace(/[,.]/g, ""))), {
      message: "Đơn giá không hợp lệ",
    })
    .refine((val) => Number(val.replace(/[,.]/g, "")) > 0, {
      message: "Đơn giá phải lớn hơn 0",
    }),
});

// Định nghĩa schema validation với Zod
const transactionFormSchema = z
  .object({
    partnerId: z
      .string({
        required_error: "Vui lòng chọn đối tác",
      })
      .min(1, {
        message: "Vui lòng chọn đối tác",
      }),
    transactionType: z
      .string({
        required_error: "Vui lòng chọn loại giao dịch",
      })
      .min(1, {
        message: "Vui lòng chọn loại giao dịch",
      }),
    amount: z
      .string()
      .min(1, { message: "Vui lòng nhập số tiền" })
      .refine((val) => !isNaN(Number(val.replace(/[,.]/g, ""))), {
        message: "Số tiền không hợp lệ",
      })
      .refine((val) => Number(val.replace(/[,.]/g, "")) > 0, {
        message: "Số tiền phải lớn hơn 0",
      }),
    date: z.string({
      required_error: "Vui lòng chọn ngày giao dịch",
    }),
    items: z.array(productItemSchema).optional(),
    notes: z.string().optional(),
    status: z.string({
      required_error: "Vui lòng chọn trạng thái",
    }),
    paidAmount: z.string().optional(),
    paymentMethod: z.string().optional(),
  })
  .refine(
    (data) => {
      // Nếu là giao dịch bán hàng, phải có ít nhất 1 sản phẩm
      if (
        data.transactionType === TransactionType.SALE &&
        (!data.items || data.items.length === 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Giao dịch bán hàng phải có ít nhất một sản phẩm",
      path: ["items"],
    }
  );

// Định nghĩa kiểu dữ liệu từ schema
type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export default function NewTransactionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPaymentType, setIsPaymentType] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      partnerId: "",
      transactionType: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      items: [{ productName: "", quantity: "", price: "" }],
      notes: "",
      status: "",
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Cập nhật loại giao dịch
  const handleTransactionTypeChange = (value: string) => {
    setIsPaymentType(value === "payment");

    // Reset sản phẩm khi chọn thanh toán
    if (value === "payment") {
      form.setValue("items", []);
    } else if (
      value === "sale" &&
      (!form.getValues("items") || form.getValues("items")?.length === 0)
    ) {
      // Thêm một sản phẩm trống nếu chuyển sang bán hàng và chưa có sản phẩm nào
      form.setValue("items", [{ productName: "", quantity: "", price: "" }]);
    }
  };

  // Tính tổng tiền từ danh sách sản phẩm
  const calculateTotalAmount = () => {
    const items = form.getValues("items") || [];
    let total = 0;

    items.forEach((product) => {
      const quantity = Number(product.quantity) || 0;
      const price = Number(product.price?.replace(/[,.]/g, "")) || 0;
      total += quantity * price;
    });

    setTotalAmount(total);

    // Cập nhật trường amount nếu có sản phẩm
    if (total > 0) {
      form.setValue("amount", total.toLocaleString());
    }
  };

  // Theo dõi thay đổi của loại giao dịch
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "transactionType") {
        handleTransactionTypeChange(value.transactionType || "");
      }

      // Tính lại tổng tiền khi thay đổi sản phẩm
      if (name?.includes("items")) {
        calculateTotalAmount();
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const {
    data: partnerOptions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getListPartnerOptions"],
    queryFn: async () => {
      const response =
        await AdminDebtManagementRequestApis.getListPartnerOptions();
      return response.payload?.data;
    },
  });

  // Xử lý submit form
  const onSubmit = async (data: TransactionFormValues) => {
    setLoading(true);

    try {
      // Chuyển đổi số tiền từ chuỗi sang số
      const amountValue = Number.parseInt(data.amount.replace(/[,.]/g, ""));
      const paidAmountValue = data.paidAmount
        ? Number.parseInt(data.paidAmount?.replace(/[,.]/g, ""))
        : 0;

      // Xử lý danh sách sản phẩm
      const processedProducts =
        data.items?.map((product) => ({
          productName: product.productName,
          quantity: Number.parseFloat(product.quantity),
          price: Number.parseInt(product.price.replace(/[,.]/g, "")),
          total:
            Number.parseFloat(product.quantity) *
            Number.parseInt(product.price.replace(/[,.]/g, "")),
        })) || [];

      // Chuẩn bị dữ liệu để gửi đi
      const transactionData = {
        ...data,
        amount: amountValue,
        items: processedProducts,
        paidAmount: paidAmountValue,
      };

      console.log("Submitting transaction:", transactionData);

      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Chuyển hướng sau khi tạo giao dịch thành công
      // router.push("/transactions");
    } catch (error) {
      console.error("Error creating transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format số tiền với dấu phân cách hàng nghìn
  const formatCurrency = (value: number) => {
    return value.toLocaleString() + " ₫";
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Thêm giao dịch mới
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giao dịch</CardTitle>
              <CardDescription>
                Nhập thông tin chi tiết về giao dịch mới
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="partnerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Đối tác <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn đối tác" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="overflow-y-auto">
                          {isLoading && (
                            <p className="text-sm text-center">Đang tải ...</p>
                          )}

                          {!isLoading && isError && (
                            <p className="text-sm text-center">
                              Không thể tải danh sách đối tác
                            </p>
                          )}
                          {partnerOptions?.map((partner) => (
                            <SelectItem key={partner.id} value={partner.id}>
                              {partner.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transactionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Loại giao dịch <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại giao dịch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {transactionTypeOptions.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("partnerId") && (
                <div className="p-4 border rounded-md bg-muted">
                  <p className="font-medium">
                    Công nợ hiện tại:{" "}
                    {formatCurrency(
                      partnerOptions?.find(
                        (partner) => partner.id === form.watch("partnerId")
                      )?.remainingDebt || 0
                    )}
                  </p>
                </div>
              )}

              {isPaymentType && (
                <Alert className="bg-blue-50 text-blue-700 border-blue-200">
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Lưu ý</AlertTitle>
                  <AlertDescription>
                    Đây là giao dịch thanh toán công nợ. Vui lòng nhập số tiền
                    đối tác thanh toán vào trường &quot;Số tiền&quot;. Hệ thống
                    sẽ tự động cập nhật công nợ của đối tác.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Ngày giao dịch <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Trạng thái <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {transactionStatusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Hiển thị phương thức thanh toán khi trạng thái là "paid" hoặc "partial" */}
              {(form.watch("status") === TransactionStatus.PAID ||
                form.watch("status") === TransactionStatus.PARTIAL) && (
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phương thức thanh toán{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn phương thức thanh toán" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {transactionPaymentMethodOptions.map((method) => (
                            <SelectItem value={method.value} key={method.value}>
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Hiển thị trường nhập số tiền đã thanh toán khi trạng thái là "partial" */}
              {form.watch("status") === TransactionStatus.PARTIAL && (
                <FormField
                  control={form.control}
                  name="paidAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Số tiền đã thanh toán{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập số tiền đã thanh toán"
                          {...field}
                          onChange={(e) => {
                            // Format số tiền khi nhập
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            const formattedValue = value
                              ? Number(value).toLocaleString()
                              : "";
                            field.onChange(formattedValue);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Nhập số tiền đã thanh toán (phải nhỏ hơn tổng số tiền
                        giao dịch)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {!isPaymentType && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Danh sách sản phẩm</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        append({ productName: "", quantity: "", price: "" })
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm sản phẩm
                    </Button>
                  </div>

                  {fields.length === 0 && (
                    <Alert variant="destructive">
                      <AlertTitle>Lưu ý</AlertTitle>
                      <AlertDescription>
                        Giao dịch bán hàng phải có ít nhất một sản phẩm. Vui
                        lòng thêm sản phẩm.
                      </AlertDescription>
                    </Alert>
                  )}

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border rounded-md space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Sản phẩm #{index + 1}</h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <FormField
                          control={form.control}
                          name={`items.${index}.productName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Tên sản phẩm{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nhập tên sản phẩm"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Số lượng (kg){" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nhập số lượng"
                                  {...field}
                                  type="number"
                                  step="0.1"
                                  min="0"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Đơn giá <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nhập đơn giá"
                                  {...field}
                                  value={
                                    typeof field.value === "string"
                                      ? field.value
                                      : ""
                                  }
                                  onChange={(e) => {
                                    // Format số tiền khi nhập
                                    const value = e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
                                    const formattedValue = value
                                      ? Number(value).toLocaleString()
                                      : "";
                                    field.onChange(formattedValue);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Hiển thị thành tiền cho từng sản phẩm */}
                      {form.watch(`items.${index}.quantity`) &&
                        form.watch(`items.${index}.price`) && (
                          <div className="text-right text-sm">
                            <span className="font-medium">Thành tiền: </span>
                            {formatCurrency(
                              Number(form.watch(`items.${index}.quantity`)) *
                                Number(
                                  form
                                    .watch(`items.${index}.price`)
                                    .replace(/[,.]/g, "")
                                )
                            )}
                          </div>
                        )}
                    </div>
                  ))}

                  {/* Hiển thị tổng tiền */}
                  {fields.length > 0 && totalAmount > 0 && (
                    <div className="p-4 border rounded-md bg-muted">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Tổng tiền:</span>
                        <span className="text-lg font-bold text-primary">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập ghi chú về giao dịch"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => router.back()}
                type="button"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading || !form.formState.isValid}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Lưu giao dịch"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
