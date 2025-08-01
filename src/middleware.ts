import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessTokenFyn");

  if (!token) {
    return NextResponse.redirect(
      new URL("/authentication", request.nextUrl.origin)
    );
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
