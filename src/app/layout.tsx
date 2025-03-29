import type { Metadata } from "next";
import localFont from 'next/font/local';
import { Manrope, Geist_Mono } from 'next/font/google';
import "./globals.css";
import { Providers } from "./providers";


// Load Boldonse font locally
const boldonse = localFont({
  src: '../fonts/Boldonse-Regular.ttf',
  variable: '--font-boldonse',
  display: 'swap',
});

// Import Manrope font
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

// Import Geist Mono font
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Timely - Your ideas, amplified",
  description: "Privacy-first AI that helps you create in confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${boldonse.variable} ${manrope.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
