import { authApiRequest } from "@/api-request/auth";
import { TokenType } from "@/constants/types";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const requestBody = await request.json();
  /*
    - Có 2 trường hợp là 
      + Người dùng logout bình thường
      + 2 là hết hạn phiên đăng nhập => forceLogout = true
  */
  const forceLogout = requestBody.forceLogout as boolean | undefined;
  const accessToken = cookieStore.get(TokenType.AccessToken);
  if (!accessToken || !accessToken.value) {
    return Response.json(
      {
        message: "Không nhận được token",
      },
      {
        status: 401,
      }
    );
  }
  const headers = new Headers();
  headers.append("Set-Cookie", "accessToken=; Path=/; HttpOnly");
  headers.append("Set-Cookie", "refreshToken=; Path=/; HttpOnly");
  if (forceLogout) {
    return Response.json(
      {
        message: "Phiên đăng nhập đã hết hạn",
      },
      {
        status: 200,
        headers,
      }
    );
  }
  try {
    authApiRequest.logoutFromNextServerToApiServer(accessToken.value);
    return Response.json(
      {
        message: "Đăng xuất thành công",
      },
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          message: "Lỗi không xác định",
        },
        {
          status: 500,
        }
      );
    }
  }
}
