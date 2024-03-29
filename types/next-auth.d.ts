import { User, DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    id: number;
    emailVerified: boolean;
    isAdmin: boolean;
  }
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User extends DefaultUser {
    id: number;
    email: string;
  }

  interface AdapterUser extends User {
    id: number;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    email: string;
    emailVerified: boolean;
    isAdmin: boolean;
  }
}
