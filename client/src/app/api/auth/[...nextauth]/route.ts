import NextAuth from "next-auth";
import { AuthConfig } from "@/lib/auth";

const handler = NextAuth(AuthConfig)
    
export { handler as GET, handler as POST }