import { DefaultSession, JWT } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      /** The user's ID. */
      id?: string;
    } & DefaultSession["user"];
  }
  
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
} 