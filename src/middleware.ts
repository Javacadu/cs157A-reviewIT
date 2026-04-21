import { NextResponse, type NextRequest } from "next/server";

/**
 * Auth middleware for ReviewIT
 *
 * Validates session cookie for protected routes.
 * Middleware runs at the edge before server components,
 * so we only validate the cookie format (base64 encoded "userId:username").
 * Full session validation with database happens in server components.
 */

const COOKIE_NAME = "session";

/**
 * Public routes that don't require authentication.
 */
const PUBLIC_ROUTES = ["/", "/auth", "/search"];

/**
 * Route patterns that are public (dynamic routes).
 */
const PUBLIC_PATTERNS = [
  // Item detail pages
  /^\/item\/[\w-]+$/,
];

/**
 * Determines if a route is public.
 */
function isPublicRoute(pathname: string): boolean {
  // Exact match public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true;
  }

  // Check dynamic route patterns
  for (const pattern of PUBLIC_PATTERNS) {
    if (pattern.test(pathname)) {
      return true;
    }
  }

  return false;
}

/**
 * Determines if the request is for a static file or Next.js internal route.
 * These should never be intercepted.
 */
function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") || // Next.js build files
    pathname.startsWith("/api") || // API routes (handled separately)
    /\.(png|jpg|jpeg|gif|svg|ico|webp|js|css|woff|woff2|ttf|eot)$/i.test(
      pathname
    ) // Static assets
  );
}

/**
 * Validates the session cookie format.
 * Checks if cookie exists and has valid base64 "userId:username" format.
 *
 * Note: Full session validation with database happens in server components.
 * This middleware only validates cookie format since it runs at the edge.
 */
function isValidSessionCookie(token: string | undefined): boolean {
  if (!token) {
    return false;
  }

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [userIdStr, username] = decoded.split(":");

    const userId = parseInt(userIdStr, 10);

    // Valid if userId is a number and username is present
    return !isNaN(userId) && !!username && username.length > 0;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow static assets and Next.js internals
  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  // Always allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check session cookie
  const sessionCookie = request.cookies.get(COOKIE_NAME);
  const isAuthenticated = isValidSessionCookie(sessionCookie?.value);

  if (!isAuthenticated) {
    // Redirect to auth page
    const authUrl = new URL("/auth", request.url);
    authUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(authUrl);
  }

  return NextResponse.next();
}

/**
 * Configure which routes the middleware applies to.
 * Match all paths except static files.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};