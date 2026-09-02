import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { journalSchema, journalIssueSchema } from "@/lib/validations/publication";

export async function GET() {
  try {
    const journals = await prisma.journal.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        issues: {
          orderBy: [{ volume: "desc" }, { issue: "desc" }],
          include: {
            publications: {
              where: { status: "PUBLISHED" },
              select: {
                id: true,
                title: true,
                slug: true,
                type: true,
                abstract: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(journals);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch journals" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.journalId) {
      const validated = journalIssueSchema.parse(body);
      const issue = await prisma.journalIssue.create({
        data: {
          journalId: validated.journalId,
          volume: validated.volume,
          issue: validated.issue,
          title: validated.title,
          description: validated.description,
          coverImageUrl: validated.coverImageUrl,
          pdfUrl: validated.pdfUrl,
          publishedAt: validated.publishedAt ? new Date(validated.publishedAt) : new Date()
        }
      });
      return NextResponse.json(issue, { status: 201 });
    }

    const validated = journalSchema.parse(body);
    const slug = validated.slug || validated.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    const journal = await prisma.journal.create({
      data: {
        title: validated.title,
        slug,
        description: validated.description,
        coverImageUrl: validated.coverImageUrl
      }
    });

    return NextResponse.json(journal, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create journal or issue" }, { status: 400 });
  }
}
