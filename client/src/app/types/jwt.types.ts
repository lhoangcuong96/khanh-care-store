import { CookieType } from "@/constants/types";

export type CookieTypeValue = (typeof CookieType)[keyof typeof CookieType];

export interface AccountJwtPayload {
  id: string;
  email: string;
  role: string;
  fullname: string;
  avatar?: string | null;
  phoneNumber?: string | null;
}

export interface TokenPayload {
  account: AccountJwtPayload;
  tokenType: CookieTypeValue;
  exp: number;
  iat: number;
}
