import { PrismaClient, PublicationType, PublicationStatus, Category } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.publicationAuthor.deleteMany();
  await prisma.publicationTag.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.journalIssue.deleteMany();
  await prisma.journal.deleteMany();
  await prisma.author.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();

  const categories: Category[] = await Promise.all([
    prisma.category.create({
      data: {
        name: "Diplomacy",
        slug: "diplomacy",
        description: "Bilateral negotiations, multilateral pacts, and diplomatic statecraft."
      }
    }),
    prisma.category.create({
      data: {
        name: "International Relations",
        slug: "international-relations",
        description: "Geopolitical risk analysis, alliance dynamics, and strategic diplomacy."
      }
    }),
    prisma.category.create({
      data: {
        name: "Women & Leadership",
        slug: "women-leadership",
        description: "Female political praxis, executive governance, and systemic inclusion."
      }
    }),
    prisma.category.create({
      data: {
        name: "Gender & Policy",
        slug: "gender-policy",
        description: "Policy audits, institutional mainstreaming, and legal reform."
      }
    }),
    prisma.category.create({
      data: {
        name: "Peace & Security",
        slug: "peace-security",
        description: "Ceasefire negotiation, conflict resolution, and post-conflict mediation."
      }
    }),
    prisma.category.create({
      data: {
        name: "Global Governance",
        slug: "global-governance",
        description: "Multilateral institutions, international treaties, and international law."
      }
    }),
    prisma.category.create({
      data: {
        name: "Foreign Policy",
        slug: "foreign-policy",
        description: "Ministry strategy, ambassadorial representation, and diplomatic corps analysis."
      }
    })
  ]);

  const categoryMap = new Map<string, Category>(categories.map((c: Category) => [c.slug, c]));

  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "Women", slug: "women" } }),
    prisma.tag.create({ data: { name: "Diplomacy", slug: "diplomacy" } }),
    prisma.tag.create({ data: { name: "Leadership", slug: "leadership" } }),
    prisma.tag.create({ data: { name: "Policy", slug: "policy" } }),
    prisma.tag.create({ data: { name: "Peace", slug: "peace" } }),
    prisma.tag.create({ data: { name: "Security", slug: "security" } }),
    prisma.tag.create({ data: { name: "Governance", slug: "governance" } }),
    prisma.tag.create({ data: { name: "Technology", slug: "technology" } }),
    prisma.tag.create({ data: { name: "Climate", slug: "climate" } })
  ]);

  const authors = await Promise.all([
    prisma.author.create({
      data: {
        name: "Dr. Amara Sterling",
        slug: "dr-amara-sterling",
        biography: "Senior Research Fellow specializing in international security treaties and peace process empirical modeling.",
        affiliation: "AIPP Security Studies Division",
        position: "Senior Research Fellow",
        photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
        email: "a.sterling@aipp-institute.org"
      }
    }),
    prisma.author.create({
      data: {
        name: "Ambassador Miriam Chen",
        slug: "ambassador-miriam-chen",
        biography: "Former Chief Negotiator and Distinguished Diplomat in Residence at the Athena Institute.",
        affiliation: "AIPP Diplomatic Council",
        position: "Distinguished Diplomat in Residence",
        photoUrl: "https://images.unsplash.com/photo-1580894732413-a75151b1424e?auto=format&fit=crop&q=80&w=300",
        email: "m.chen@aipp-institute.org"
      }
    }),
    prisma.author.create({
      data: {
        name: "Sophia Al-Mansoor",
        slug: "sophia-al-mansoor",
        biography: "Lead researcher on emerging technology governance, cyber diplomacy, and international ethical standards.",
        affiliation: "AIPP Cyber & Technology Praxis",
        position: "Director of Technology & Diplomacy",
        photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300",
        email: "s.almansoor@aipp-institute.org"
      }
    }),
    prisma.author.create({
      data: {
        name: "Dr. Katelyn Thorne",
        slug: "dr-katelyn-thorne",
        biography: "Specialist in coastal sovereignty, island statecraft, and multilateral environmental treaties.",
        affiliation: "AIPP Climate Security Initiative",
        position: "Chair of Climate Security Praxis",
        photoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=300",
        email: "k.thorne@aipp-institute.org"
      }
    })
  ]);

  const journal = await prisma.journal.create({
    data: {
      title: "AIPP Journal of International Diplomacy & Gender Governance",
      slug: "aipp-journal-international-diplomacy",
      description: "Quarterly peer-reviewed international policy publication examining female leadership, conflict resolution, and global statecraft.",
      coverImageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000"
    }
  });

  const journalIssue = await prisma.journalIssue.create({
    data: {
      journalId: journal.id,
      volume: 3,
      issue: 2,
      title: "Women, Diplomacy & Global Governance",
      description: "Volume 03 Issue 02 focusing on structured inclusion in ceasefire talks, cyber norms, and coastal resilience pacts.",
      coverImageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000",
      pdfUrl: "/uploads/pdf/aipp_journal_v3_i2.pdf",
      publishedAt: new Date("2026-08-15")
    }
  });

  const pub1 = await prisma.publication.create({
    data: {
      title: "Women at the Negotiation Table: Impact Metrics in Multilateral Peace Treaties (2000–2025)",
      slug: "women-at-negotiation-table-impact-metrics-peace-treaties",
      abstract: "A comprehensive 25-year empirical assessment demonstrating how structured female inclusion in ceasefire negotiations correlates with a 35% increase in treaty longevity across 40 post-conflict zones worldwide.",
      description: "This landmark study analyzes 120 bilateral and multilateral negotiations between 2000 and 2025. Leveraging quantitative regression models and qualitative delegation audits, the paper outlines structural mechanisms through which female negotiators introduce durable post-conflict economic provisions and legal enforcement safeguards.",
      type: PublicationType.RESEARCH_PAPER,
      status: PublicationStatus.PUBLISHED,
      publicationDate: new Date("2026-08-20"),
      publishedAt: new Date("2026-08-20"),
      year: 2026,
      coverImageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000",
      pdfUrl: "/uploads/pdf/women_negotiation_table_2026.pdf",
      pdfFileName: "women_negotiation_table_2026.pdf",
      pdfFileSize: 2450000,
      pdfMimeType: "application/pdf",
      doi: "10.1080/aipp.sec.2026.04",
      downloadCount: 1420,
      categoryId: categoryMap.get("peace-security")?.id,
      journalIssueId: journalIssue.id,
      authors: {
        create: [
          { authorId: authors[0].id, order: 0 },
          { authorId: authors[1].id, order: 1 }
        ]
      },
      tags: {
        create: [
          { tagId: tags[0].id },
          { tagId: tags[1].id },
          { tagId: tags[4].id },
          { tagId: tags[5].id }
        ]
      }
    }
  });

  const pub2 = await prisma.publication.create({
    data: {
      title: "Reframing AI Governance: Female Leadership in Emerging Technology Diplomacy",
      slug: "reframing-ai-governance-female-leadership-technology-diplomacy",
      abstract: "Strategic recommendations for integrating human-centric ethical frameworks into international artificial intelligence treaties and multilateral technology standards.",
      description: "As foreign policy establishments confront rapid generative AI deployment, this policy brief offers actionable guidance for chief negotiators to imbed rights-respecting standards into global tech pacts.",
      type: PublicationType.POLICY_BRIEF,
      status: PublicationStatus.PUBLISHED,
      publicationDate: new Date("2026-07-28"),
      publishedAt: new Date("2026-07-28"),
      year: 2026,
      coverImageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
      pdfUrl: "/uploads/pdf/ai_governance_tech_diplomacy_2026.pdf",
      pdfFileName: "ai_governance_tech_diplomacy_2026.pdf",
      pdfFileSize: 1840000,
      pdfMimeType: "application/pdf",
      doi: "10.1080/aipp.tech.2026.02",
      downloadCount: 890,
      categoryId: categoryMap.get("global-governance")?.id,
      authors: {
        create: [{ authorId: authors[2].id, order: 0 }]
      },
      tags: {
        create: [
          { tagId: tags[0].id },
          { tagId: tags[3].id },
          { tagId: tags[7].id }
        ]
      }
    }
  });

  const pub3 = await prisma.publication.create({
    data: {
      title: "Climate Statecraft in the Indo-Pacific: Women-Led Coastal Resilience Treaties",
      slug: "climate-statecraft-indo-pacific-women-led-coastal-resilience",
      abstract: "Examining regional pacts spearheaded by Pacific Island women leaders to protect maritime sovereignty and coastal economies under rising sea levels.",
      description: "Coastal and island nations face existential threats requiring innovative legal statecraft. This comprehensive report documents 8 women-led regional initiatives that established legal precedents for maritime boundary retention.",
      type: PublicationType.REPORT,
      status: PublicationStatus.PUBLISHED,
      publicationDate: new Date("2026-06-14"),
      publishedAt: new Date("2026-06-14"),
      year: 2026,
      coverImageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
      pdfUrl: "/uploads/pdf/climate_statecraft_indo_pacific_2026.pdf",
      pdfFileName: "climate_statecraft_indo_pacific_2026.pdf",
      pdfFileSize: 3120000,
      pdfMimeType: "application/pdf",
      doi: "10.1080/aipp.clim.2026.01",
      downloadCount: 670,
      categoryId: categoryMap.get("foreign-policy")?.id,
      authors: {
        create: [{ authorId: authors[3].id, order: 0 }]
      },
      tags: {
        create: [
          { tagId: tags[0].id },
          { tagId: tags[1].id },
          { tagId: tags[8].id }
        ]
      }
    }
  });

  const pub4 = await prisma.publication.create({
    data: {
      title: "Institutional Barriers in Foreign Ministries: A Global Audit of Female Ambassadors",
      slug: "institutional-barriers-foreign-ministries-female-ambassadors-audit",
      abstract: "Surveying career progression, assignment bias, and structural retention factors across 52 foreign ministries globally.",
      description: "Despite increased female enrollment in diplomatic academies, structural bottlenecks persist at ambassadorial appointments. This journal article provides empirical recommendations for systemic career reform.",
      type: PublicationType.JOURNAL,
      status: PublicationStatus.PUBLISHED,
      publicationDate: new Date("2026-05-10"),
      publishedAt: new Date("2026-05-10"),
      year: 2026,
      coverImageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
      pdfUrl: "/uploads/pdf/foreign_ministries_ambassador_audit.pdf",
      pdfFileName: "foreign_ministries_ambassador_audit.pdf",
      pdfFileSize: 4200000,
      pdfMimeType: "application/pdf",
      doi: "10.1080/aipp.audit.2026.03",
      downloadCount: 1100,
      categoryId: categoryMap.get("women-leadership")?.id,
      journalIssueId: journalIssue.id,
      authors: {
        create: [
          { authorId: authors[1].id, order: 0 },
          { authorId: authors[0].id, order: 1 }
        ]
      },
      tags: {
        create: [
          { tagId: tags[0].id },
          { tagId: tags[2].id },
          { tagId: tags[3].id }
        ]
      }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
