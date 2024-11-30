import {
  clerkMiddleware,
  clerkClient,
  createRouteMatcher,
  AuthObject
} from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

const publicRoutes = ["/api/webhook/register", "/sign-in(.*)", "/sign-up(.*)"]

const isPublicRoutes = createRouteMatcher(publicRoutes)

export default clerkMiddleware(async (authPromise, req) => {
  const clerk = await clerkClient()
  const auth = await authPromise() // Resolve the auth promise
  if (!isPublicRoutes(req)) {
    NextResponse.redirect(new URL("/sign-in", req.url))
    return afterAuth(auth, req)
  }

  async function afterAuth(auth: AuthObject, req: NextRequest) {
    //handle unauth users trying to access protected route
    if (!auth.userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }

    if (auth.userId) {
      try {
        const user = (await clerk.users.getUser(auth.userId)) ?? undefined
        const role = user?.publicMetadata?.role as string | undefined

        //admin role redirection
        if (role === "admin" && req.nextUrl.pathname === "/") {
          return NextResponse.redirect(new URL("/erp/admin/dashboard", req.url))
        }

        //prevent non admin user to go to admin paths
        if (role !== "admin" && req.nextUrl.pathname.startsWith("/admin")) {
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }

        //redirect auth users trying to access public routes
        if (publicRoutes.includes(req.nextUrl.pathname)) {
          return NextResponse.redirect(
            new URL(
              role === "admin" ? "/admin/dashboard" : "/dashboard",
              req.url
            )
          )
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred"
        console.error("Auth Error:", errorMessage)
        return NextResponse.redirect(new URL("/error", req.url))
      }
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
}
