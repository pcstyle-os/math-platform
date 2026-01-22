import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Neon Atlas AI - Szybki Solver",
    short_name: "Solver",
    description: "Błyskawiczny solver zadań szkolnych z AI. Zrób zdjęcie - dostań odpowiedź.",
    start_url: "/solver",
    display: "standalone",
    orientation: "portrait",
    background_color: "#000000",
    theme_color: "#ff00ff",
    categories: ["education", "utilities"],
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
    screenshots: [
      {
        src: "/screenshots/solver-mobile.png",
        sizes: "390x844",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Solver",
        short_name: "Solve",
        description: "Szybki solver zadań",
        url: "/solver",
        icons: [{ src: "/pwa-icon.svg", sizes: "any" }],
      },
      {
        name: "Dashboard",
        short_name: "Home",
        description: "Panel główny",
        url: "/dashboard",
        icons: [{ src: "/pwa-icon.svg", sizes: "any" }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
