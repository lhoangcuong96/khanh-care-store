import { http } from "@/lib/http";
import {
  AddTransactionBodyType,
  AddTransactionResponseType,
  CreatePartnerResponseType,
  CreatePartnerType,
  GetListPartnerOptionResponseType,
  GetListPartnerParamsType,
  GetListPartnerResponseType,
} from "@/validation-schema/admin/debt-management";
import { MessageResponseType } from "@/validation-schema/common";

const AdminDebtManagementRequestApis = {
  createPartner: (data: CreatePartnerType) => {
    return http.post<CreatePartnerResponseType>(
      "/admin/debt-management/partner",
      data,
      {
        isAdminRequest: true,
        isPrivate: true,
      }
    );
  },
  getListPartners: ({
    page = 1,
    limit = 20,
    search = "",
  }: GetListPartnerParamsType) => {
    return http.get<GetListPartnerResponseType>(
      `/admin/debt-management/partner?page=${page}&limit${limit}&search=${search}`,
      {
        isAdminRequest: true,
        isPrivate: true,
      }
    );
  },

  getListPartnerOptions: () => {
    return http.get<GetListPartnerOptionResponseType>(
      "/admin/debt-management/partner/options",
      {
        isAdminRequest: true,
        isPrivate: true,
      }
    );
  },

  deletePartner: (id: string) => {
    return http.post<MessageResponseType>(
      `/admin/debt-management/partner/${id}/delete`,
      {},
      {
        isAdminRequest: true,
        isPrivate: true,
      }
    );
  },

  addTransaction: (body: AddTransactionBodyType) => {
    return http.post<AddTransactionResponseType>(
      "/admin/debt-management/transaction",
      body,
      {
        isAdminRequest: true,
        isPrivate: true,
      }
    );
  },
};

export default AdminDebtManagementRequestApis;
