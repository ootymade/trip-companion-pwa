import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OotyMade Trip Companion",
    short_name: "OotyMade Trip",
    description:
      "Real-time help for Ooty and the Nilgiris — E-Pass, toy train, attractions, trip planner and AI concierge.",
    start_url: "/?source=pwa",
    display: "standalone",
    background_color: "#1E3A1A",
    theme_color: "#1E3A1A",
    orientation: "portrait-primary",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
