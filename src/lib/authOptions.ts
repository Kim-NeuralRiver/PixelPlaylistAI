import { NextAuthOptions, DefaultSession } from "next-auth";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { PrismaClient } from "@prisma/client";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

// Simplified NextAuth - only for Google/Email, NOT credentials
export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        allowDangerousEmailAccountLinking: true
      })
    ] : []),

    ...(process.env.MAILGUN_USERNAME ? [
      EmailProvider({
        server: {
          host: "smtp.mailgun.org",
          port: 587,
          auth: {
            user: process.env.MAILGUN_USERNAME,
            pass: process.env.MAILGUN_PASSWORD,
          },
        },
        from: process.env.MAILGUN_FROM,
      })
    ] : []),
  ],
  pages: {
    signIn: "/sign-in", 
  },
  callbacks: {
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Note: The below has been commented out while I test some changes here.


/* const prisma = new PrismaClient(); 

declare module "next-auth" {
  interface User {
    id: string;
    name: string | null; 
    email: string | null;
    image: string | null;
    role: string | null;
  }
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: string;
    };
  }
}


declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    name: string;
    email: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: "smtp.mailgun.org",
        port: 587,
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD,
        },
      },
      from: process.env.MAILGUN_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("User not found or password is missing");
        }
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id || token.sub || "";
        token.name = user.name || token.name || "";
        token.email = user.email || token.email || "";
        token.role = user.role || token.role || "";
      }
      return token;
    },
    redirect({ baseUrl }) {
      return baseUrl;
    }
    
    },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
 */