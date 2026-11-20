import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth/permissions";
import { InquiryStatus, InquiryPriority, Prisma } from "@prisma/client";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  "Pragma": "no-cache",
};

/**
 * Hardened CSV Cell Sanitizer for Enterprise Spreadsheet Security (RFC 4180 + OWASP CSV Injection Defense).
 *
 * Spreadsheet engines (Excel, Google Sheets, LibreOffice Calc) evaluate formulas if a cell
 * begins with '=', '+', '-', '@', '|', or '%' — even when preceded by spaces, tabs, carriage returns,
 * newlines, ASCII control codes, Unicode whitespace, or Byte Order Mark (BOM) characters.
 *
 * Defense Strategy:
 * 1. Remove dangerous invisible prefix characters (BOM \uFEFF, zero-width characters).
 * 2. If the cell begins with a formula trigger (=, +, -, @, |, %) directly OR after stripping leading
 *    whitespace/control characters, prepend a single quote (') to force literal text rendering.
 * 3. Correctly escape all embedded double quotes by doubling them ("").
 * 4. Wrap the entire cell in double quotes according to RFC 4180.
 */
function sanitizeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return '""';
  }

  let str = String(value);

  // 1. Strip leading BOM (\uFEFF) and zero-width spaces from the front of the cell
  str = str.replace(/^[\uFEFF\u200B-\u200D]+/, "");

  // 2. Identify if the cell contains a formula trigger either directly or preceded by whitespace / control chars
  // Regex includes: ASCII whitespace (\s), ASCII control chars (\x00-\x1F, \x7F), Unicode whitespace (\u00A0, \u2000-\u200A, \u2028, \u2029, \u202F, \u205F, \u3000)
  const leadingWhitespaceControlRegex = /^[\s\x00-\x1F\x7F\u00A0\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]*/;
  const stripped = str.replace(leadingWhitespaceControlRegex, "");

  const FORMULA_TRIGGERS = /^[=+\-@|%]/;
  if (FORMULA_TRIGGERS.test(str) || FORMULA_TRIGGERS.test(stripped)) {
    str = `'${str}`;
  }

  // 3. Escape double quotes according to RFC 4180 (double each quote)
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

export async function GET(request: Request) {
  const auth = await requireAdminAuth(request, "export_inquiries");
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const statusParam = searchParams.get("status")?.trim();
    const typeParam = searchParams.get("inquiryType")?.trim();
    const priorityParam = searchParams.get("priority")?.trim();
    const assignedToParam = searchParams.get("assignedTo")?.trim();
    const dateFromParam = searchParams.get("dateFrom")?.trim();
    const dateToParam = searchParams.get("dateTo")?.trim();
    const sortParam = searchParams.get("sort") || "newest";

    const where: Prisma.ContactInquiryWhereInput = {};

    if (statusParam && statusParam !== "ALL") {
      if (Object.values(InquiryStatus).includes(statusParam as InquiryStatus)) {
        where.status = statusParam as InquiryStatus;
      }
    }

    if (typeParam && typeParam !== "ALL") {
      where.inquiryType = typeParam;
    }

    if (priorityParam && priorityParam !== "ALL") {
      if (Object.values(InquiryPriority).includes(priorityParam as InquiryPriority)) {
        where.priority = priorityParam as InquiryPriority;
      }
    }

    if (assignedToParam && assignedToParam !== "ALL") {
      if (assignedToParam === "UNASSIGNED") {
        where.assignedToId = null;
      } else {
        where.assignedToId = assignedToParam;
      }
    }

    if (dateFromParam || dateToParam) {
      where.createdAt = {};
      if (dateFromParam) {
        const fromDate = new Date(dateFromParam);
        if (!isNaN(fromDate.getTime())) {
          where.createdAt.gte = fromDate;
        }
      }
      if (dateToParam) {
        const toDate = new Date(dateToParam);
        if (!isNaN(toDate.getTime())) {
          toDate.setHours(23, 59, 59, 999);
          where.createdAt.lte = toDate;
        }
      }
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { referenceNumber: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { organization: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: Prisma.ContactInquiryOrderByWithRelationInput =
      sortParam === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

    const inquiries = await prisma.contactInquiry.findMany({
      where,
      orderBy,
      take: 5000, // Safe upper boundary for memory and bandwidth
      include: {
        assignedTo: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const headers = [
      "Reference Number",
      "Received At",
      "Full Name",
      "Email Address",
      "Organization",
      "Phone",
      "Inquiry Type",
      "Subject",
      "Status",
      "Priority",
      "Assigned Administrator",
      "Source Form",
      "Resolved At",
    ];

    const rows = inquiries.map((inq) => [
      sanitizeCsvCell(inq.referenceNumber),
      sanitizeCsvCell(inq.createdAt.toISOString()),
      sanitizeCsvCell(inq.fullName),
      sanitizeCsvCell(inq.email),
      sanitizeCsvCell(inq.organization || "N/A"),
      sanitizeCsvCell(inq.phone || "N/A"),
      sanitizeCsvCell(inq.inquiryType),
      sanitizeCsvCell(inq.subject || "N/A"),
      sanitizeCsvCell(inq.status),
      sanitizeCsvCell(inq.priority),
      sanitizeCsvCell(inq.assignedTo ? inq.assignedTo.name : "Unassigned"),
      sanitizeCsvCell(inq.sourceForm),
      sanitizeCsvCell(inq.resolvedAt ? inq.resolvedAt.toISOString() : "N/A"),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const filename = `aipp-inquiries-${new Date().toISOString().split("T")[0]}.csv`;

    return new Response(csvContent, {
      status: 200,
      headers: {
        ...NO_CACHE_HEADERS,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("[API Inquiries Export Error]:", error);
    return NextResponse.json(
      { error: "Failed to export inquiries." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

