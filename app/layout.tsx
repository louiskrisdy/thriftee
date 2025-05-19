import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Roboto } from "next/font/google";
import "./globals.css";

import Nav from "@/components/navigation/nav";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Toaster from "@/components/ui/toaster";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({ 
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"]
 });

export const metadata: Metadata = {
  title: "THRIFTEE",
  description: "Thriftee-Desc",
  icons: {
    icon: "/favicon_thriftee2.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_CLIENT_KEY} strategy="afterInteractive"></Script>
      <body suppressHydrationWarning className={cn("min-h-screen flex flex-col", roboto.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex-grow px-6 md:px-12 mx-auto w-full max-w-8xl">
            <Nav />
            <Toaster />
            {children}
          </div>

          <footer className="bg-primary py-1 mt-5 rounded-t-md shadow-sm dark:bg-[#111111] dark:text-[#F5F5F5] w-full">
            <div className="mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
              <span className="text-sm text-gray-200 sm:text-center dark:text-white">
                © 2025 <a href="/" className="hover:underline">Thriftee</a>. All Rights Reserved.
              </span>
              <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-200 dark:text-white sm:mt-0">
                <li><a href="/about-us" className="hover:underline me-4 md:me-6">About Us</a></li>
                <li><a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a></li>
                <li><a href="mailto:admin@thriftee.co.id?subject=Customer%20Inquiry&body=Hi%20Thriftee%2C%0A" className="hover:underline">Contact</a></li>
              </ul>
            </div>
          </footer>
        </ThemeProvider>
      </body>

    </html>
  );
}
