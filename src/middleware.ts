import { i18nRouter } from 'next-i18n-router';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import i18nConfig from '../i18nConfig';

export const middleware = async (request: NextRequest) => {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl.clone();

  // Define private and public routes
  const publicRoutes = ['/sign-in', '/sign-up', '/about', '/faq', '/contact-us', '/privacy-policy'];
  const privateRoutes = ['/admin-page'];

  const isPublicRoute = publicRoutes.some((route) => url.pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) => url.pathname.startsWith(route));

  // Handle private routes
  if (isPrivateRoute && !token) {
    // Redirect to login if not authenticated
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  // Handle redirect from login/signup for authenticated users
  if (isPublicRoute && token && url.pathname === '/sign-in') {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Apply i18n routing
  return i18nRouter(request, i18nConfig);
};

// Applies this middleware only to files in the app directory
export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};
