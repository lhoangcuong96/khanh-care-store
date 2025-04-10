import { Account } from "@prisma/client";
import { jwtDecode } from "jwt-decode";

export const getAccountFromAccessToken = async (
  accessToken: string
): Promise<Account> => {
  const tokenPayload = jwtDecode<{ account: Account }>(accessToken);
  if (!tokenPayload?.account) {
    throw new Error("Account not found in token payload");
  }
  const account = tokenPayload.account;

  return account;
};
