import { http } from "@/lib/http";
import { GetLandingResponseType } from "@/validation-schema/landing";

const landingApiRequest = {
  getLandingData: async (id?: string) => {
    const response = await http.post<GetLandingResponseType>(`/landing`, {
      userId: id,
    });
    return response;
  },
};

export default landingApiRequest;
