import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { AegisChatWidget } from "@/components/aegis-chat-widget";
import { GeoJsonLd } from "@/components/geo-json-ld";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: `${DATA.name} | Fullstack Engineer`,
    template: `%s | ${DATA.name}`,
  },
  description: DATA.description,
  applicationName: DATA.name,
  authors: [{ name: DATA.name, url: DATA.url }],
  creator: DATA.name,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/logo_papu.png", type: "image/png" },
    ],
    apple: "/logo_papu.png",
    shortcut: "/logo_papu.png",
  },
  keywords: [
    "Yabibal Eshetie",
    "Yabibal Eshetie Molla",
    "Yabibal portfolio",
    "Fullstack engineer",
    "Full-stack developer",
    "AI security",
    "LLM",
    "RAG",
    "Automation",
    "AWS",
    "TypeScript",
    "Next.js",
    "Web developer Ethiopia",
    "Addis Ababa developer",
    "MERN stack",
  ],
  openGraph: {
    title: `${DATA.name} | Fullstack Engineer`,
    description: DATA.description,
    url: DATA.url,
    siteName: DATA.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: DATA.ogImage,
        alt: DATA.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${DATA.name} | Fullstack Engineer`,
    description: DATA.description,
    images: [DATA.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  /** Helps aggregators treat the site as a personal brand surface. */
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen overflow-x-hidden bg-background font-sans antialiased relative",
          inter.variable,
          jetbrainsMono.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <GeoJsonLd />
          <Toaster position="top-center" />
          <TooltipProvider delayDuration={0}>
            <div className="absolute inset-0 top-0 left-0 right-0 h-[100px] overflow-hidden z-0">
              <FlickeringGrid
                className="h-full w-full"
                squareSize={2}
                gridGap={2}
                style={{
                  maskImage: "linear-gradient(to bottom, black, transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black, transparent)",
                }}
              />
            </div>
            <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-6 py-12 pb-28 sm:px-8 sm:py-24 sm:pb-32">
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
            <Navbar />
            <AegisChatWidget />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
