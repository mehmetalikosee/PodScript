import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/upload"];
const authPaths = ["/login", "/signup"];

function isProtected(pathname: string) {
  return protectedPaths.some((p) => pathname.startsWith(p));
}

function isAuthPath(pathname: string) {
  return authPaths.some((p) => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (isProtected(pathname) && !user) {
    const redirect = new URL("/login", request.url);
    redirect.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirect);
  }

  if (
    isProtected(pathname) &&
    user &&
    !user.email_confirmed_at &&
    !pathname.startsWith("/dashboard/confirm-email")
  ) {
    return NextResponse.redirect(new URL("/dashboard/confirm-email", request.url));
  }

  if (isAuthPath(pathname) && user) {
    const redirectTo = request.nextUrl.searchParams.get("redirectTo") ?? "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
