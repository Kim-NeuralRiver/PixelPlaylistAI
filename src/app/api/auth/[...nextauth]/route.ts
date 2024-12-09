import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Adjust path as needed

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
