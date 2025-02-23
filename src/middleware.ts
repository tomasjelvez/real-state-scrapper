import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// This function will wrap the handling of each request
export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true if the user is authenticated, false otherwise
      authorized: ({ token }) => !!token,
    },
    pages: {
      // When not authorized, redirect to this page
      signIn: "/auth",
    },
  }
);

// Configure which routes to protect
export const config = {
  matcher: [
    // Protected routes that require authentication
    "/",

    // Exclude auth routes, api routes, and static files
    "/((?!auth|api|_next/static|_next/image|favicon.ico).*)",
  ],
};
