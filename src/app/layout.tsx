import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { auth } from "@/lib/auth";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "RentCar Admin",
  description: "ระบบจัดการเช่ารถ",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" className={cn("font-sans", inter.variable)} suppressHydrationWarning>
      <body className="min-h-screen bg-[#f6f7f9] text-slate-950 antialiased">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
