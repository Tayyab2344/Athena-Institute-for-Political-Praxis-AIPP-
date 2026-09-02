import { z } from "zod";

export const PublicationTypeEnum = z.enum([
  "RESEARCH_PAPER",
  "JOURNAL",
  "POLICY_BRIEF",
  "REPORT"
]);

export const PublicationStatusEnum = z.enum([
  "DRAFT",
  "UNDER_REVIEW",
  "APPROVED",
  "PUBLISHED",
  "ARCHIVED"
]);

export const publicationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(2, "Slug must be valid").optional(),
  abstract: z.string().min(10, "Abstract must be at least 10 characters"),
  description: z.string().optional(),
  type: PublicationTypeEnum,
  status: PublicationStatusEnum.default("DRAFT"),
  publicationDate: z.string().optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  pdfUrl: z.string().optional().or(z.literal("")),
  pdfFileName: z.string().optional(),
  pdfFileSize: z.number().optional(),
  pdfMimeType: z.string().optional(),
  doi: z.string().optional(),
  categoryId: z.string().optional(),
  journalIssueId: z.string().optional(),
  authorIds: z.array(z.string()).min(1, "Select at least one author"),
  tagNames: z.array(z.string()).optional()
});

export const authorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().optional(),
  biography: z.string().optional(),
  affiliation: z.string().optional(),
  position: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal(""))
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name required"),
  slug: z.string().optional(),
  description: z.string().optional()
});

export const journalSchema = z.object({
  title: z.string().min(2, "Journal title required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal(""))
});

export const journalIssueSchema = z.object({
  journalId: z.string().min(1, "Journal is required"),
  volume: z.number().int().min(1),
  issue: z.number().int().min(1),
  title: z.string().min(2, "Issue title required"),
  description: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  pdfUrl: z.string().optional().or(z.literal("")),
  publishedAt: z.string().optional()
});

export type PublicationInput = z.infer<typeof publicationSchema>;
export type AuthorInput = z.infer<typeof authorSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type JournalInput = z.infer<typeof journalSchema>;
export type JournalIssueInput = z.infer<typeof journalIssueSchema>;
