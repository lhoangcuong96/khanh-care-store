export enum PartnerType {
  INDIVIDUAL = "INDIVIDUAL",
  BUSINESS = "BUSINESS",
  DISTRIBUTOR = "DISTRIBUTOR",
  SUPPLIER = "SUPPLIER",
}

export enum TransactionType {
  SALE = "SALE",
  PURCHASE = "PURCHASE",
  PAYMENT = "PAYMENT",
  REFUND = "REFUND",
}

export enum TransactionStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  PARTIAL = "PARTIAL",
}

export enum TransactionPaymentMethod {
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
  CREDIT_CARD = "CREDIT_CARD",
  OTHER = "OTHER",
}

export const partnerTypeOptions = [
  {
    value: PartnerType.INDIVIDUAL,
    label: "Cá nhân",
  },
  {
    value: PartnerType.BUSINESS,
    label: "Doanh nghiệp",
  },
  {
    value: PartnerType.DISTRIBUTOR,
    label: "Nhà phân phối",
  },
  {
    value: PartnerType.SUPPLIER,
    label: "Nhà cung cấp",
  },
];

export const transactionTypeOptions = [
  {
    value: TransactionType.SALE,
    label: "Bán hàng",
  },
  {
    value: TransactionType.PURCHASE,
    label: "Mua hàng",
  },
  {
    value: TransactionType.PAYMENT,
    label: "Thanh toán",
  },
  {
    value: TransactionType.REFUND,
    label: "Hoàn tiền",
  },
];

export const transactionStatusOptions = [
  {
    value: TransactionStatus.PAID,
    label: "Đã thanh toán",
  },
  {
    value: TransactionStatus.UNPAID,
    label: "Chưa thanh toán",
  },
  {
    value: TransactionStatus.PARTIAL,
    label: "Một phần",
  },
];

export const transactionPaymentMethodOptions = [
  {
    value: TransactionPaymentMethod.CASH,
    label: "Tiền mặt",
  },
  {
    value: TransactionPaymentMethod.BANK_TRANSFER,
    label: "Chuyển khoản",
  },
  {
    value: TransactionPaymentMethod.CREDIT_CARD,
    label: "Thẻ tín dụng",
  },
  {
    value: TransactionPaymentMethod.OTHER,
    label: "Khác",
  },
];
