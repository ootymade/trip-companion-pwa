import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, Noto_Sans_Tamil, Noto_Sans_Devanagari, Noto_Sans_Malayalam, Noto_Sans_Kannada } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { getServerLocale } from "@/lib/i18n/getLocale";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// One subsetted font per script, each only fetched by the browser when a
// page actually renders text in that script (preload: false means no
// eager <link rel=preload> for a font most visitors will never need) — a
// Tamil-reading visitor downloads Noto Sans Tamil, an English-only visitor
// downloads none of these four, so per-locale weight stays at zero cost
// for everyone else.
const notoTamil = Noto_Sans_Tamil({ variable: "--font-noto-ta", subsets: ["tamil"], weight: ["400", "600"], preload: false });
const notoDevanagari = Noto_Sans_Devanagari({ variable: "--font-noto-hi", subsets: ["devanagari"], weight: ["400", "600"], preload: false });
const notoMalayalam = Noto_Sans_Malayalam({ variable: "--font-noto-ml", subsets: ["malayalam"], weight: ["400", "600"], preload: false });
const notoKannada = Noto_Sans_Kannada({ variable: "--font-noto-kn", subsets: ["kannada"], weight: ["400", "600"], preload: false });

export const metadata: Metadata = {
  metadataBase: new URL("https://trip.ootymade.com"),
  title: {
    default: "OotyMade Trip Companion",
    template: "%s | OotyMade Trip Companion",
  },
  description:
    "Real-time, in-pocket help for Ooty and the Nilgiris — E-Pass steps, toy train timings, attraction hours, a trip planner and an AI concierge, no app download needed.",
  applicationName: "OotyMade Trip Companion",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "OotyMade Trip",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E3A1A",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getServerLocale();

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${dmSans.variable} ${notoTamil.variable} ${notoDevanagari.variable} ${notoMalayalam.variable} ${notoKannada.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LocaleProvider initialLocale={locale}>
          <ServiceWorkerRegistration />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
