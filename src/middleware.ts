import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessTokenFyn");

  if (!token) {
    return NextResponse.redirect(
      new URL("/authentication", request.nextUrl.origin)
    );
  }

  const payload = decodeJwt(token.value);

  if (!payload || (payload.exp && Date.now() >= payload.exp * 1000)) {
    // Token is expired
    const response = NextResponse.redirect(
      new URL("/authentication", request.nextUrl.origin)
    );
    response.cookies.delete("accessTokenFyn"); // clean up cookie
    return response;
  }

  if (pathname.startsWith("/dashboard/tenant-creation")) {
    // Dashboard-specific middleware logic
    const currentTenantId = request.cookies.get("currentTenant");
    if (!currentTenantId) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
