import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Extract subdomain
  const subdomain = extractSubdomain(hostname);
  
  if (subdomain) {
    // Rewrite subdomain.localhost:3000/path to localhost:3000/company/subdomain/path
    url.pathname = `/company/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

function extractSubdomain(hostname: string): string | null {
  // Handle localhost development
  if (hostname.includes('localhost')) {
    const parts = hostname.split('.');
    if (parts.length >= 2 && parts[0] !== 'localhost') {
      return parts[0]; // Return subdomain part
    }
  }
  
  // Handle production domains (sahod.solutions)
  if (hostname.includes('sahod.solutions')) {
    const parts = hostname.split('.');
    if (parts.length >= 3 && parts[0] !== 'www') {
      return parts[0];
    }
  }
  
  return null;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};