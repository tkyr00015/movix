import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  themeColor: "#E50914",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-netflix-black text-white min-h-screen flex flex-col antialiased selection:bg-netflix-red selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        
        {/* Netflix-style Minimal Footer */}
        <footer className="border-t border-zinc-900 bg-black text-zinc-500 py-10 px-4 sm:px-6 lg:px-8 text-xs space-y-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
            <p className="text-zinc-600">
              Disclaimer: {siteConfig.name} does not host any media files. All streams are scraped and embedded from third-party services.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
