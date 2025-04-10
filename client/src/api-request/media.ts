import { http } from "@/lib/http";
import { UploadResponseType } from "@/validation-schema/common";

export const mediaRequestApi = {
  uploadImage: async (body: FormData) => {
    const res = await http.post<UploadResponseType>("/media/upload", body, {
      method: "POST",
      baseUrl: process.env.NEXT_PUBLIC_API_SERVER,
    });
    return res;
  },
};
