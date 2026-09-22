import type { MetadataRoute } from "next";

const ROUTES = [
  "/",
  "/products",
  "/libraries",
  "/projects/notebooklm",
  "/projects/bridgehook",
  "/projects/tether",
  "/projects/mercala",
  "/activity",
  "/how-i-work",
  "/stack",
  "/stack/bun",
  "/stack/go",
  "/stack/java",
  "/stack/next",
  "/stack/expo",
  "/stack/cloudflare",
  "/stack/python",
  "/stack/postgres",
  "/stack/agents",
  "/about",
  "/training",
  "/training/ai-in-practice-2026",
  "/design-system",
  "/products/voxtar",
  "/products/aurahealth",
  "/products/coursified",
  "/products/hypatia",
  "/products/mb3prepbot",
  "/products/vectorless",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `https://hallelx2.com${route === "/" ? "" : route}`,
    lastModified: new Date(),
  }));
}
