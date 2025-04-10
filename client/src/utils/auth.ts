import envConfig from "@/envConfig";
import { differenceInSeconds } from "date-fns";
import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (accessToken: string) => {
  if (accessToken) {
    const decoded = jwtDecode(accessToken);
    const expireAt = new Date(decoded.exp || "");
    const currentTime = new Date();
    const diffInSecond = differenceInSeconds(expireAt, currentTime);
    if (
      diffInSecond <
      +(envConfig?.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRES_IN || "1") * 60
    ) {
      return true;
    }
    return false;
  } else {
    return true;
  }
};
