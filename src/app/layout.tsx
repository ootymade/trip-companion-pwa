import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ServiceWorkerRegistration />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
