import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const path = request.nextUrl.pathname;

  if (["/", "/signin", "/signup"].includes(path)) {
    if (token) {
      const role = token.role as string;
      if (role === "pending") return NextResponse.redirect(new URL("/pending", request.url));
      if (role === "admin") return NextResponse.redirect(new URL("/admin", request.url));
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (path === "/pending") {
    if (!token) return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    if ((token.role as string) !== "pending") return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  if (path.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    if ((token.role as string) !== "admin") return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  if (path.startsWith("/dashboard") || path.startsWith("/profile") || path.startsWith("/directory") || path.startsWith("/events") || path.startsWith("/newsletter") || path.startsWith("/donate")) {
    if (!token) return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    if ((token.role as string) === "pending") return NextResponse.redirect(new URL("/pending", request.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/signin",
    "/signup",
    "/pending",
    "/dashboard/:path*",
    "/profile/:path*",
    "/directory/:path*",
    "/events/:path*",
    "/newsletter/:path*",
    "/donate",
    "/admin/:path*",
  ],
};
