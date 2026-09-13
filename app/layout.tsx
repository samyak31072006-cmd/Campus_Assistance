import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DemoRoleBanner } from "@/components/ui/demo-role-banner";
import { Navbar } from "@/components/navbar";
import { MobileNav } from "@/components/mobile-nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CampusAssist — Your Deadline. Sorted.",
  description:
    "Reliable assignment writing assistance (priced per page) and CAD engineering drawing drafting right inside your college campus.",
  keywords: [
    "assignment help",
    "CAD drawing service",
    "engineering drawing sheets",
    "campus assignment writing",
    "college drafting assistance",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-brand-bg text-brand-navy font-sans pb-16 md:pb-0">
        <DemoRoleBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <MobileNav />
      </body>
    </html>
  );
}
