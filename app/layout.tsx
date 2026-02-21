import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const APP_URL = "https://mideeye.com";
const APP_NAME = "MIDEEYE";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0d9488",
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "MIDEEYE — Weydii. Wadaag. Horumar.",
    template: "%s | MIDEEYE",
  },
  description:
    "Bulshada Soomaaliyeed ee isu kaashanaysa mideynta aqoonta. Ask questions, share knowledge, and grow together.",
  applicationName: APP_NAME,
  keywords: [
    "Somali",
    "Somalia",
    "community",
    "knowledge",
    "questions",
    "answers",
    "Somali platform",
    "Somali forum",
    "education",
    "horumar",
    "mideeye",
  ],
  authors: [{ name: "MIDEEYE Team", url: APP_URL }],
  creator: "MIDEEYE",
  publisher: "MIDEEYE",
  category: "social network",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
  openGraph: {
    type: "website",
    locale: "so_SO",
    alternateLocale: ["en_US"],
    url: APP_URL,
    siteName: APP_NAME,
    title: "MIDEEYE — Weydii. Wadaag. Horumar.",
    description:
      "The Somali knowledge community. Ask, answer, and build together.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MIDEEYE — Somali Knowledge Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mideeye",
    creator: "@mideeye",
    title: "MIDEEYE — Weydii. Wadaag. Horumar.",
    description:
      "The Somali knowledge community. Ask, answer, and build together.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [{ rel: "mask-icon", url: "/favicon.svg", color: "#0d9488" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MIDEEYE",
    url: "https://mideeye.com",
    description:
      "Bulshada Soomaaliyeed ee isu kaashanaysa mideynta aqoonta. Ask questions, share knowledge, and grow together.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://mideeye.com/questions?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    sameAs: [
      "https://twitter.com/mideeye",
      "https://instagram.com/mideeye",
      "https://linkedin.com/company/mideeye",
    ],
  };

  return (
    <html lang="so" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <Header />
          <main className="min-h-screen pt-safe-header pb-safe-bottom md:pb-0">
            {children}
          </main>
          <BottomNav />
          <Footer className="hidden md:block" />
          <Toaster />
        </ThemeProvider>
        {/* Register service worker */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js', { scope: '/' })
                  .catch(function(err) { console.log('SW registration failed:', err); });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
