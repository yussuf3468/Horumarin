import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MIDEEYE - Weydii. Wadaag. Horumar.",
  description: "Bulshada Soomaaliyeed ee Isu Kaashanaysa mideynta Aqoonta",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="so" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Header />
          <main className="min-h-screen pt-11 pb-16 md:pb-0">{children}</main>
          <BottomNav />
          <Footer className="hidden md:block" />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
