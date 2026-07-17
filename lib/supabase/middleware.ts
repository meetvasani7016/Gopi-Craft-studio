import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const isConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isSetupRequiredPage = request.nextUrl.pathname === "/admin/setup-required";

  if (isAdminRoute && !isConfigured && !isSetupRequiredPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/setup-required";
    return NextResponse.redirect(url);
  }

  if (!isConfigured) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Retrieve user session securely
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    // Verify admin role authorization
    const { data: profile } = await supabase
      .from("admin_users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["super_admin", "admin", "editor"].includes(profile.role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      const response = NextResponse.redirect(url);
      
      // Clear auth cookies
      const cookieName = `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "").split(".")[0]}-auth-token`;
      response.cookies.delete(cookieName);
      return response;
    }
  }

  // Redirect admin users from login back to dashboard if they are already authenticated
  if (isLoginPage && user) {
    const { data: profile } = await supabase
      .from("admin_users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile && ["super_admin", "admin", "editor"].includes(profile.role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
