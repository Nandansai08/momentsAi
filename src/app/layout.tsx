import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MomentsAI - Turn Memories Into Beautiful Websites",
  description: "Create beautifully personalized, emotional websites for birthdays, anniversaries, proposals, friendships, graduations, farewells, weddings, and special life moments in minutes.",
  openGraph: {
    title: "MomentsAI - Turn Memories Into Beautiful Websites",
    description: "Create beautifully personalized, emotional websites for birthdays, anniversaries, proposals, friendships, graduations, farewells, weddings, and special life moments in minutes.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
