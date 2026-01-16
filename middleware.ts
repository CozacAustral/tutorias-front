import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function middleware(request: NextRequest) {
  console.log("Middleware ejecutado para:", request.nextUrl.pathname);

  const authTokens = request.cookies.get("authTokens")?.value;

  const protectedRoutes = [
    "/tutores",
    "/alumnos",
    "/administradores",
    "/carrera",
    "/alumnos_asignados",
    "/profile",
  ];
  if (
    protectedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    ) &&
    !authTokens
  ) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("authTokens");
    return response;
  }

  if (authTokens && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/tutores/:path*",
    "/alumnos/:path*",
    "/administradores/:path*",
    "/login",
    "/carrera/:path*",
    "/alumnos_asignados/:path",
    "/profile",
    "/reuniones/:path"
  ],
};
