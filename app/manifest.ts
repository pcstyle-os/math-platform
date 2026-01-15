import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MathPrep AI",
    short_name: "MathPrep",
    description: "Generuj rozbudowane plany nauki matematyki z pomocą AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#ff00ff",
    icons: [
      {
        src: "/pwa-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/pwa-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
