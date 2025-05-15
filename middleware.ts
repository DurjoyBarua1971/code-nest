import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect routes under /dashboard
  const protectedPaths = ["/dashboard", "/create", "/list"];
  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/create/:path*", "/list/:path*"],
};
