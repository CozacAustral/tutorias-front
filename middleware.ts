import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export function middleware(request: NextRequest) {
    console.log('Middleware ejecutado para:', request.nextUrl.pathname);

    const authTokens = request.cookies.get('authTokens')?.value;

    const protectedRoutes = ['/Tutores', '/Alumnos', '/Administradores', '/MiPerfil'];
    if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) && !authTokens) {
        const response = NextResponse.redirect(new URL('/Login', request.url));
        response.cookies.delete('authTokens'); 
        return response;
    }

    if (authTokens && request.nextUrl.pathname === '/Login') {
        return NextResponse.redirect(new URL('/', request.url)); 
    }

    return NextResponse.next();
}


export const config = {
    matcher: ['/Tutores/:path*', '/Alumnos/:path*', '/Administradores/:path*', '/Login', '/MiPerfil/:path*'],
};