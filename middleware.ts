import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_ROUTES = ["/login", "/"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // السماح للصفحات العامة
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("smartzone_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any;

    // الاشتراك منتهي
    if (new Date(user.subscriptionEnd) < new Date()) {
      return NextResponse.redirect(new URL("/login?expired=1", req.url));
    }

    return NextResponse.next();

  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/support/:path*",
    "/faq/:path*"
  ]
};
