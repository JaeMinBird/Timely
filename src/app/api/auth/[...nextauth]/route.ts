import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Simple NextAuth configuration that works for both local and Vercel deployment
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  // A simple secret generation approach for development
  secret: process.env.NEXTAUTH_SECRET || "development_secret_do_not_use_in_production",
});

export { handler as GET, handler as POST }; 