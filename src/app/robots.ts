import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://aipp-institute.org";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/api",
        "/api/",
        "/newsletter/verify",
        "/newsletter/unsubscribe",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

