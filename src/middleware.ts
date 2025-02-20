import {
  clerkMiddleware,
  clerkClient,
  createRouteMatcher
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

  async function afterAuth(auth: any, req: NextRequest) {
    //handle unauth users trying to access protected route
    if (!auth.userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }

    if (auth.userId) {
      try {
        const user = (await clerk.users.getUser(auth.userId)) ?? undefined
        const role = user.publicMetadata.role as string | undefined

        if (role == "superuser") return
        //admin role redirection
        if (role == "university_admin" && req.nextUrl.pathname === "/") {
          return NextResponse.redirect(new URL("/admin", req.url))
        }
        if (role == "department_admin" && req.nextUrl.pathname === "/") {
          return NextResponse.redirect(new URL("/department_admin", req.url))
        }

        //teacher role redirection
        if (role == "faculty" && req.nextUrl.pathname === "/") {
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }

        if (role == "authority" && req.nextUrl.pathname === "/") {
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }

        //teacher role redirection
        if (role == "student" && req.nextUrl.pathname === "/") {
          return NextResponse.redirect(new URL("/student", req.url))
        }

        //prevent non admin user to go to admin paths
        if (
          role !== "university_admin" &&
          req.nextUrl.pathname.startsWith("/admin")
        ) {
          return NextResponse.redirect(new URL("/", req.url))
        }

        //redirect auth users trying to access public routes (eg:"/sign-in")
        if (publicRoutes.includes(req.nextUrl.pathname)) {
          return NextResponse.redirect(
            new URL(role === "university_admin" ? "/admin" : "/", req.url)
          )
        }
      } catch (error) {
        console.error("error in middleware: ", error)
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
