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

export const JournalStatusEnum = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED"
]);

export const publicationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(2, "Slug must be valid").optional(),
  abstract: z.string().min(10, "Abstract must be at least 10 characters"),
  description: z.string().optional().nullable(),
  type: PublicationTypeEnum,
  status: PublicationStatusEnum.default("DRAFT"),
  publicationDate: z.string().optional().nullable(),
  year: z.number().int().min(1900).max(2100).optional().nullable(),
  coverImageUrl: z.string().url().optional().or(z.literal("")).nullable(),
  pdfUrl: z.string().optional().or(z.literal("")).nullable(),
  pdfFileName: z.string().optional().nullable(),
  pdfFileSize: z.number().optional().nullable(),
  pdfMimeType: z.string().optional().nullable(),
  coverImageAssetId: z.string().optional().nullable(),
  pdfAssetId: z.string().optional().nullable(),
  doi: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  journalIssueId: z.string().optional().nullable(),
  authorIds: z.array(z.string()).min(1, "Select at least one author"),
  tagNames: z.array(z.string()).optional()
});

export const publicationUpdateSchema = publicationSchema.partial();

export const authorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().optional(),
  biography: z.string().optional().nullable(),
  affiliation: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  photoUrl: z.string().url().optional().or(z.literal("")).nullable(),
  photoAssetId: z.string().optional().nullable(),
  email: z.string().email().optional().or(z.literal("")).nullable()
});

export const authorUpdateSchema = authorSchema.partial();

export const categorySchema = z.object({
  name: z.string().min(2, "Category name required"),
  slug: z.string().optional(),
  description: z.string().optional().nullable()
});

export const journalSchema = z.object({
  title: z.string().min(2, "Journal title required"),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  status: JournalStatusEnum.optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")).nullable(),
  coverImageAssetId: z.string().optional().nullable()
});

export const journalUpdateSchema = journalSchema.partial();

export const journalIssueSchema = z.object({
  journalId: z.string().min(1, "Journal is required"),
  volume: z.number().int().min(1),
  issue: z.number().int().min(1),
  title: z.string().min(2, "Issue title required"),
  description: z.string().optional().nullable(),
  status: JournalStatusEnum.optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")).nullable(),
  coverImageAssetId: z.string().optional().nullable(),
  pdfUrl: z.string().optional().or(z.literal("")).nullable(),
  pdfAssetId: z.string().optional().nullable(),
  publishedAt: z.string().optional().nullable()
});

export const journalIssueUpdateSchema = journalIssueSchema.partial();

export type PublicationInput = z.infer<typeof publicationSchema>;
export type PublicationUpdateInput = z.infer<typeof publicationUpdateSchema>;
export type AuthorInput = z.infer<typeof authorSchema>;
export type AuthorUpdateInput = z.infer<typeof authorUpdateSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type JournalInput = z.infer<typeof journalSchema>;
export type JournalUpdateInput = z.infer<typeof journalUpdateSchema>;
export type JournalIssueInput = z.infer<typeof journalIssueSchema>;
export type JournalIssueUpdateInput = z.infer<typeof journalIssueUpdateSchema>;
