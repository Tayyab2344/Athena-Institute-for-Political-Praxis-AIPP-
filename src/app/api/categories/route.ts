import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/publication";
import { requireAdminAuth } from "@/lib/auth/permissions";
import { validateRequestOrigin } from "@/lib/auth/csrf";

const FALLBACK_CATEGORIES = [
  { id: "cat-1", name: "Diplomacy", slug: "diplomacy", description: "Bilateral negotiations, multilateral pacts, and diplomatic statecraft." },
  { id: "cat-2", name: "International Relations", slug: "international-relations", description: "Geopolitical risk analysis, alliance dynamics, and strategic diplomacy." },
  { id: "cat-3", name: "Women & Leadership", slug: "women-leadership", description: "Female political praxis, executive governance, and systemic inclusion." },
  { id: "cat-4", name: "Gender & Policy", slug: "gender-policy", description: "Policy audits, institutional mainstreaming, and legal reform." },
  { id: "cat-5", name: "Peace & Security", slug: "peace-security", description: "Ceasefire negotiation, conflict resolution, and post-conflict mediation." },
  { id: "cat-6", name: "Global Governance", slug: "global-governance", description: "Multilateral institutions, international treaties, and international law." },
  { id: "cat-7", name: "Foreign Policy", slug: "foreign-policy", description: "Ministry strategy, ambassadorial representation, and diplomatic corps analysis." }
];

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { publications: true }
        }
      }
    });

    return NextResponse.json(categories.length > 0 ? categories : FALLBACK_CATEGORIES);
  } catch (error) {
    return NextResponse.json(FALLBACK_CATEGORIES);
  }
}

export async function POST(request: Request) {
  // Validate request origin for mutation
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  // Require administrator authentication with manage_categories permission
  const auth = await requireAdminAuth(request, "manage_categories");
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const validated = categorySchema.parse(body);

    const slug = validated.slug || validated.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const category = await prisma.category.create({
      data: {
        name: validated.name,
        slug,
        description: validated.description
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 400 });
  }
}
