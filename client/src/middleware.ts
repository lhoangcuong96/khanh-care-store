// Middleware phải nằm cùng cấp với /app và trong /src

import { RoleType } from "@prisma/client";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authApiRequest } from "./api-request/auth";
import { PayloadJWT } from "./app/api/auth/route";
import { routePath } from "./constants/routes";
import { isTokenExpired } from "./utils/auth";
import { jwtDecode } from "jwt-decode";
const privateRoutes = ["account", "admin", "cart", "checkout"];
const authRoutes = ["sign-in", "sign-up"];

async function handleRefreshToken(
  accessToken: string,
  refreshToken: string | undefined,
  request: NextRequest
) {
  if (refreshToken) {
    const resp = await authApiRequest.refreshTokenFromNextServerToApiServer(
      accessToken,
      refreshToken
    );
    if (resp && resp.payload?.data.accessToken) {
      // set lại request header với accessToken mới
      const response = NextResponse.next();
      response.cookies.set("accessToken", resp.payload.data.accessToken, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
      });
      response.cookies.set("refreshToken", resp.payload.data.refreshToken, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
      });
      return response;
    } else {
      return NextResponse.redirect(new URL(routePath.signOut, request.url));
    }
  }
  if (!refreshToken) {
    return NextResponse.redirect(new URL(routePath.signOut, request.url));
  }
}

function isPrivateRoute(pathname: string) {
  if (privateRoutes.some((path) => pathname.includes(path))) {
    return true;
  }
  return false;
}

function isAuthRoute(pathname: string) {
  if (authRoutes.some((route) => pathname.includes(route))) {
    return true;
  }
  return false;
}

function isAdminRoute(pathname: string) {
  if (pathname.includes("admin")) {
    return true;
  }
  return false;
}

function isAdminRole(account?: PayloadJWT["account"]) {
  if (!account?.role || RoleType.ADMIN !== account?.role) {
    return false;
  }
  return true;
}

function isIndex(pathname: string) {
  if (pathname === routePath.index) {
    return true;
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const headers = new Headers(request.headers);
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  let account: PayloadJWT["account"] | undefined;
  headers.set("x-pathname", request.nextUrl.pathname);

  if (accessToken) {
    const tokenPayload = jwtDecode<PayloadJWT>(accessToken);
    account = tokenPayload?.account;
  }

  if (isIndex(pathname)) {
    return NextResponse.redirect(
      new URL(routePath.customer.home, request.url),
      {
        headers,
      }
    );
  }

  if (accessToken && isTokenExpired(accessToken)) {
    console.log("accessToken expired");
    return await handleRefreshToken(accessToken, refreshToken, request);
  }

  if (accessToken && isAuthRoute(pathname)) {
    const previousUrl = request.headers.get("referer") || "/";
    return NextResponse.redirect(new URL(previousUrl), {
      headers,
    });
  }

  if (accessToken && isAdminRoute(pathname) && !isAdminRole(account)) {
    return NextResponse.redirect(
      new URL(routePath.customer.home, request.url),
      {
        headers,
      }
    );
  }

  // unauthorized
  if (!accessToken && isPrivateRoute(pathname)) {
    return NextResponse.redirect(new URL(routePath.signIn, request.url), {
      headers,
    });
  }
  return NextResponse.next({
    headers,
  });
}

export const config = {
  // bắt buộc phải rõ ra chứ không sử dụng spread operator được
  // matcher: [...privatePaths, ...publicPaths],
  matcher: [
    "/account/:path*",
    "/admin/:path*",
    "/cart",
    "/checkout",
    "/sign-in",
    "/sign-up",
    "/",
    "/home",
    "/home/:path*",
    "/sign-out",
  ],
};
