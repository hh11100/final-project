import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  // Get the token from the request cookies
  const token = req.cookies.get('token')?.value;

  // Define the paths that should be protected
  const protectedPaths = ['/dashboard', '/api']; // Add more paths as needed
  const isProtectedPath = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path));

  // Allow specific paths to bypass the protection, e.g., /api/users
  const allowUnprotectedPaths = ['/api/users/login', '/api/users/signup'];
  const isUnprotectedPath = allowUnprotectedPaths.some((path) => req.nextUrl.pathname.startsWith(path));

  if (isProtectedPath && !isUnprotectedPath) {
    if (!token) {
      // Redirect to login if no token is found
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      // Verify the JWT token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // You can add additional checks here, e.g., user roles or permissions
      const response = NextResponse.next();

      // Set the user ID in a custom header for the forwarded request
      response.headers.set('x-user-id', payload.id as string);

      response.cookies.set('userId', payload.id, { httpOnly: false });

      // If everything is fine, proceed to the next middleware or the request handler
      return response;
    } catch (error) {
      console.error('JWT verification failed:', error);

      // Redirect to login if token verification fails
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // If the path is not protected, proceed as usual
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'], // Adjust to the routes you want to protect
};
