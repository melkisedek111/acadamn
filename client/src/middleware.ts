export { default } from "next-auth/middleware";
import type { NextRequest } from 'next/server'
 
// export function middleware(request: NextRequest) {
//   const currentUser = request.cookies.get('currentUser')?.value
//   console.log({currentUser})
//   if (currentUser && !request.nextUrl.pathname.startsWith('/dashboard')) {
//     return Response.redirect(new URL('/dashboard', request.url))
//   }
 
//   if (!currentUser && !request.nextUrl.pathname.startsWith('/login')) {
//     return Response.redirect(new URL('/login', request.url))
//   }
// }
 
export const config = { matcher: ["/dashboard", "/subjects", "/logout"] };
