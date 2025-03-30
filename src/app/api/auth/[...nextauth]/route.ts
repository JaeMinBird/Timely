import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

// Extend the JWT type to include our custom properties
interface ExtendedJWT extends JWT {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

// Make sure to extend the Session type properly
interface ExtendedSession extends Session {
  accessToken?: string;
  refreshToken?: string;
  // Session already includes user and expires
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar',
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      // Cast to our extended types
      const extendedSession = session as ExtendedSession;
      
      // Send properties to the client, like an access_token from a provider
      extendedSession.accessToken = token.accessToken as string;
      extendedSession.refreshToken = token.refreshToken as string;
      
      if (token?.sub) {
        extendedSession.user.id = token.sub;
      }
      
      return extendedSession;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 