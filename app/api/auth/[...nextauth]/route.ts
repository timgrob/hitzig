import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  }
}
