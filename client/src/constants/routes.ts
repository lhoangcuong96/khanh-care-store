// src/routes.ts

export const routePath = {
  index: "/",
  signIn: "/sign-in",
  signOut: "/sign-out",
  signUp: "/sign-up",
  customer: {
    home: "/home",
    products: ({
      category,
      isBestSeller,
      isFeatured,
      isPromotion,
      search,
      weight,
      price,
    }: {
      category?: string;
      isBestSeller?: boolean;
      isFeatured?: boolean;
      isPromotion?: boolean;
      search?: string;
      weight?: string | string[];
      price?: string | string[];
    } = {}) => {
      const weightValue = Array.isArray(weight)
        ? weight.map((w) => `&weight=${w}`).join("")
        : `&weight=${weight || ""}`;
      const priceValue = Array.isArray(price)
        ? price.map((p) => `&price=${p}`).join("")
        : `&price=${price || ""}`;
      return `/products/?category=${category || ""}&isBestSeller=${
        isBestSeller || ""
      }&isFeatured=${isFeatured || ""}&isPromotion=${
        isPromotion || ""
      }&search=${search || ""}${weightValue}${priceValue}`;
    },
    news: "/news",
    promotionalProduct: "/product",
    introduce: "/about-us",
    contact: "/contact-us",
    membershipPolicy: "/membership-policy",
    storeLocations: "/store-locations",
    productDetail: "/product-detail/",
    cart: "/cart",
    privacyPolicy: "/privacy-policy",
    checkout: {
      deliveryInformation: "/checkout",
      orderConfirmation: (orderCode: string) =>
        `/checkout/order-confirmation/${orderCode}`,
    },

    // private routes
    account: {
      profile: "/account/profile",
      orders: "/account/orders",
      address: "/account/address",
      vouchers: "/account/vouchers",
      shopVouchers: "/account/shop-vouchers",
      changePassword: "/account/profile/change-password",
      changePhoneNumber: "/account/change-phone-number",
      changeEmail: "/account/change-email",
      notifications: "/account/notifications",
      bank: "/account/bank",
    },
  },
  admin: {
    home: "/admin/home",
    statistic: "/admin/statistic",
    product: {
      list: "/admin/product/list",
      add: "/admin/product/add-new",
      update: (slug: string) => `/admin/product/${slug}`,
    },
    category: {
      list: "/admin/category/list",
      add: "/admin/category/add-new",
      edit: (id: string) => {
        return `/admin/category/${id}`;
      },
    },
    order: {
      list: "/admin/order/list",
    },
    debtManagement: {
      debtOverview: "/admin/debt-management/debt-overview",
      partners: "/admin/debt-management/partners",
      addPartner: "/admin/debt-management/partners/new",
      updatePartner: (id: string) =>
        `/admin/debt-management/partners/${id}/update`,
      transactions: "/admin/debt-management/transactions",
      transactionDetail: (id: string) =>
        `/admin/debt-management/transactions/${id}`,
      transactionAdd: "/admin/debt-management/transactions/new",
      transactionUpdate: (id: string) =>
        `/admin/debt-management/transactions/${id}/update`,
    },
    news: {
      list: "/admin/news/list",
      create: "/admin/news/create",
      edit: (id: string) => `/admin/news/${id}/edit`,
    },
  },
  error: "/error",
};
