import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/context";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { KisanFloatingHelp } from "@/components/farmer/KisanFloatingHelp";
import { LiveMandiTicker } from "@/components/ui/LiveMandiTicker";
import { PwaInstallPrompt } from "@/components/ui/PwaInstallPrompt";

export const viewport: Viewport = {
  themeColor: "#15803d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "SEEDSTACK — AI-Powered Agricultural Marketplace (Telangana & AP)",
  description:
    "From Farm to Market. Fair Prices. Smarter Agriculture. Direct farmer-to-vendor marketplace connecting agricultural producers in Telangana and Andhra Pradesh.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#15803d" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col bg-brand-warmBg text-brand-textPrimary antialiased">
        <AuthProvider>
          <LanguageProvider>
            <LiveMandiTicker />
            <Navbar />
            <main className="flex-1">{children}</main>
            <KisanFloatingHelp />
            <PwaInstallPrompt />
            <Footer />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
