import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { JournalStatus, PublicationStatus } from "@prisma/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://aipp-institute.org";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/what-we-offer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/what-we-offer/research-policy-innovation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/what-we-offer/strategic-action-simulation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/what-we-offer/communications-public-advocacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/research`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/journals`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/programs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/get-involved`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  try {
    const [publications, journals] = await Promise.all([
      prisma.publication.findMany({
        where: { status: PublicationStatus.PUBLISHED },
        select: { slug: true, updatedAt: true },
        take: 500,
      }),
      prisma.journal.findMany({
        where: { status: JournalStatus.PUBLISHED },
        select: { slug: true, updatedAt: true },
        take: 100,
      }),
    ]);

    const publicationRoutes: MetadataRoute.Sitemap = publications
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${baseUrl}/research/${encodeURIComponent(p.slug!)}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    const journalRoutes: MetadataRoute.Sitemap = journals
      .filter((j) => j.slug)
      .map((j) => ({
        url: `${baseUrl}/journals/${encodeURIComponent(j.slug)}`,
        lastModified: j.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    return [...staticRoutes, ...publicationRoutes, ...journalRoutes];
  } catch {
    return staticRoutes;
  }
}

