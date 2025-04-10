import { cookies } from "next/headers";

export const getTokensFromCookie = async () => {
  if (typeof window !== "undefined") {
    throw new Error("This function should be called on server side");
  }
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!accessToken || !refreshToken) {
    throw new Error("Token not found");
  }
  return { accessToken, refreshToken };
};
