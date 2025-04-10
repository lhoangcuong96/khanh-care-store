import { http } from "@/lib/http";
import { GetLandingResponseType } from "@/validation-schema/landing";

const landingApiRequest = {
  getLandingData: async () => {
    const response = await http.get<GetLandingResponseType>("/landing");
    return response;
  },
};

export default landingApiRequest;
