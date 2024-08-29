import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Reddit from "next-auth/providers/reddit";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google, Reddit],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.username && session.user) {
        session.user.username = token.username;
        session.user.email = token.email as string;
      }

      return session;
    },
    async jwt({ token, user, profile }) {
      if (!token.sub) return token;

      const existingUser = await prisma.user.findUnique({
        where: { id: token.sub },
      });

      if (!existingUser) return token;

      const username = existingUser.email?.split("@")[0];

      if (!existingUser.username) {
        await prisma.user.update({
          where: { id: token.sub },
          data: { username },
        });
      }

      token.username = existingUser.username as string;
      token.email = existingUser.email;

      return token;
    },
  },
});
