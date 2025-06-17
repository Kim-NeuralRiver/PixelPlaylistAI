import { i18nRouter } from 'next-i18n-router';
import { NextRequest, NextResponse } from 'next/server';
import i18nConfig from '../i18nConfig';

// Helper function to check if JWT token exists and is not expired
function isValidJWTToken(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    return false;
  }
}

export const middleware = async (request: NextRequest) => {
  const url = request.nextUrl.clone();
  
  // Get JWT token from cookies or localStorage (check cookies first!)
  const accessToken = request.cookies.get('access_token')?.value;
  
  // Define route categories
  const publicRoutes = ['/recommendations', '/sign-in', '/sign-up', '/about', '/faq', '/contact-us', '/privacy-policy'];
  const privateRoutes = ['/admin-page', '/settings'];
  
  const isPublicRoute = publicRoutes.some((route) => url.pathname.includes(route));
  const isPrivateRoute = privateRoutes.some((route) => url.pathname.includes(route));
  const isAuthenticated = accessToken && isValidJWTToken(accessToken);

  // Handle private routes
  if (isPrivateRoute && !isAuthenticated) {
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  // Redirect auth users away from sign-in
  if (isAuthenticated && url.pathname.includes('/sign-in')) {
    url.pathname = '/recommendations'; 
    return NextResponse.redirect(url);
  }

  // i18n routing
  return i18nRouter(request, i18nConfig);
};

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};