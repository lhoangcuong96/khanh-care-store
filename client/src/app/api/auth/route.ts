import { TokenType } from "@/constants/types";
import { SetCookieRequestDataType } from "@/validation-schema/auth";
import { jwtDecode } from "jwt-decode";

export type PayloadJWT = {
  iat: number; // thời gian tạo token(issue at)
  exp: number;
  tokenType: string;
  account: {
    id: string;
    role: string;
  };
};

// set cookie trả về cho client
export async function POST(request: Request) {
  const res: SetCookieRequestDataType = await request.json();
  const accessToken = res[TokenType.AccessToken];
  const refreshToken = res[TokenType.RefreshToken];

  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: "Không nhận được tokens",
      },
      {
        status: 400,
      }
    );
  }
  // lấy expired time từ token
  const accessTokenPayload = jwtDecode<PayloadJWT>(accessToken);
  const refreshTokenPayload = jwtDecode<PayloadJWT>(refreshToken);

  const accessTokenExpiredTime = new Date(
    accessTokenPayload.exp * 1000
  ).toUTCString();
  const refreshTokenExpiredTime = new Date(
    refreshTokenPayload.exp * 1000
  ).toUTCString();

  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `${TokenType.AccessToken}=${accessToken}; Path=/; HttpOnly; Expires=${accessTokenExpiredTime}`
  );
  headers.append(
    "Set-Cookie",
    `${TokenType.RefreshToken}=${refreshToken}; Path=/; HttpOnly; Expires=${refreshTokenExpiredTime}`
  );
  return Response.json(
    { message: "Đăng nhập thành công" },
    {
      status: 200,
      // sử dụng PATH=/ để apply cookie cho toàn domain chứ k phải chỉ 1 path bất kì
      /*
        HttpOnly => dưới client k thể truy cập dc
        => để dưới client cũng có thể gọi api => sử dụng contextApi
      */
      /*
        Samesite=Strict => chỉ gửi cookie khi request từ cùng 1 domain
                =Lax => chỉ gửi cookie khi get còn post thì không nếu như là domain ngoài
                =None => gửi cookie cho tất cả các domain
        Secure => chỉ gửi cookie khi request từ https
      */
      headers,
    }
  );
}
