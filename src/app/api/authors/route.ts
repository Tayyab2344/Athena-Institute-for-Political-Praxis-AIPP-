import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorSchema } from "@/lib/validations/publication";

export async function GET() {
  try {
    const authors = await prisma.author.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { publications: true }
        }
      }
    });

    return NextResponse.json(authors);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch authors" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = authorSchema.parse(body);

    const slug = validated.slug || validated.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const author = await prisma.author.create({
      data: {
        name: validated.name,
        slug,
        biography: validated.biography,
        affiliation: validated.affiliation,
        position: validated.position,
        photoUrl: validated.photoUrl,
        email: validated.email
      }
    });

    return NextResponse.json(author, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create author" }, { status: 400 });
  }
}
