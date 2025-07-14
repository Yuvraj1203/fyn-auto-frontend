// middleware.js
import { useCurrentTenantInfoStore } from "@/store";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const tenantInfoStore = useCurrentTenantInfoStore();
  const isAuthenticated =
    Number(tenantInfoStore.currentTenantInfo.tenantId) > 0;
  const protectedRoutes = ["/file-configs"]; // Define your protected routes

  if (protectedRoutes.includes(request.nextUrl.pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url)); // Redirect to login page
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
