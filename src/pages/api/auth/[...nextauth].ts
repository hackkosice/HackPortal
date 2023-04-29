import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginSchema } from "@/services/validation/auth";
import { prisma } from "@/services/prisma";
import { verify } from "argon2";

export const authOptions = {
  pages: {
    signIn: "/login",
    signOut: "/signout",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const creds = await loginSchema.parseAsync(credentials);

        const user = await prisma.user.findFirst({
          where: { email: creds.email },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await verify(user.password, creds.password);

        if (!isValidPassword) {
          return null;
        }

        return { id: user.id, name: user.name, email: user.email } as never;
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async session({ session, token }) {
      if (token) {
        session.id = token.id;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
