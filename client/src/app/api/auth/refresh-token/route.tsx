import { authApiRequest } from "@/api-request/auth";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: "Không nhận được token",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const result = await authApiRequest.refreshTokenFromNextServerToApiServer(
      accessToken,
      refreshToken
    );
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `accessToken=${result.payload.data?.accessToken}; Path=/; HttpOnly; SameSite=Strict`
    );
    headers.append(
      "Set-Cookie",
      `refreshToken=${result.payload.data?.refreshToken}; Path=/; HttpOnly; SameSite=Strict`
    );
    return Response.json(
      {
        message: result.payload.message,
      },
      {
        status: result.status,
        headers,
      }
    );
  } catch (error) {
    return Response.json(
      { message: (error as Error).message },
      {
        status: 500,
      }
    );
  }
}
