import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { AuthOptions } from "next-auth";

const providers: AuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials: any) {
      if (!credentials || typeof credentials.email !== 'string' || typeof credentials.password !== 'string') return null;
      const user = await prisma.user.findUnique({ where: { email: credentials.email } });
      if (user && user.password && bcrypt.compareSync(credentials.password, user.password)) {
        return user;
      }
      return null;
    },
  }),
];

// Only add Google provider if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && 
    process.env.GOOGLE_CLIENT_ID !== "your-google-client-id") {
  providers.push(GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }) as any);
}

// Only add GitHub provider if credentials are configured
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET && 
    process.env.GITHUB_CLIENT_ID !== "your-github-client-id") {
  providers.push(GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }) as any);
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: { strategy: 'jwt' as const },
  callbacks: {
    async session({ session, token, user }: any) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };