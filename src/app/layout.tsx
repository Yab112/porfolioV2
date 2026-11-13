import Footer from "@/components/Footer";
import Rail from "@/components/rail";
import { WorkWithMe } from "@/components/work-with-me";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Big_Shoulders, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteBackdrop } from "@/components/fx/site-backdrop";
import { SwarmCanvas } from "@/components/swarm/swarm-canvas";
import { CommandPalette } from "@/components/command-palette";
import { AegisChatWidget } from "@/components/aegis-chat-widget";
import { GeoJsonLd } from "@/components/geo-json-ld";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const display = Big_Shoulders({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800", "900"],
  adjustFontFallback: false,
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
          display.variable,
          jetbrainsMono.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <GeoJsonLd />
          <Toaster position="top-center" />
          <TooltipProvider delayDuration={0}>
            <SiteBackdrop />
            <SwarmCanvas />
            <div className="relative z-10 lg:pl-[4.5rem]">
              <div className="mx-auto flex min-h-dvh w-full max-w-[88rem] flex-col px-5 pb-24 sm:px-10 lg:pb-10">
                <div className="flex-1">{children}</div>
                <WorkWithMe />
                <Footer />
              </div>
            </div>
            <Rail />
            <AegisChatWidget />
            <CommandPalette />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
