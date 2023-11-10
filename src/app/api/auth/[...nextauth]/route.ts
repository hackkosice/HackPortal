import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/services/prisma";
import { verify } from "argon2";
import GitHubProvider, { GithubProfile } from "next-auth/providers/github";
import createHackerForActiveHackathon from "@/services/helpers/database/createHackerForActiveHackathon";
import { signinSchema } from "@/server/schemas/auth";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/signin",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const creds = await signinSchema.parseAsync(credentials);

        const user = await prisma.user.findFirst({
          where: { email: creds.email },
        });

        if (!user || user.password === null) {
          return null;
        }

        const isValidPassword = await verify(
          user.password as string,
          creds.password
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (dbUser) {
          token.id = Number(dbUser.id);
          token.emailVerified = dbUser.emailVerified;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.id = token.id;
        session.emailVerified = token.emailVerified;
      }

      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "github") {
        const githubProfile = profile as GithubProfile;
        await createHackerForActiveHackathon(
          prisma,
          githubProfile.email ?? "",
          {
            githubProfileId: githubProfile.id,
          }
        );
      }

      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
