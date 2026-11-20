import { z } from "zod";

export const INQUIRY_TYPES = [
  "General Institutional Inquiry",
  "Strategic Action & Simulation Wargames",
  "Policy Research & Journal Submissions",
  "Diplomatic Programs & Fellowships",
  "Institutional Partnership & Media",
] as const;

export const INQUIRY_SOURCES = [
  "CONTACT_PAGE",
  "GET_INVOLVED_PAGE",
  "HOMEPAGE_CONNECT",
  "CONTACT_MODAL",
] as const;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please provide your full name (minimum 2 characters).")
    .max(100, "Name must be under 100 characters."),
  email: z
    .string()
    .trim()
    .email("Please provide a valid institutional or personal email address.")
    .max(150, "Email must be under 150 characters."),
  subject: z
    .string()
    .trim()
    .min(1, "Please choose an inquiry type or subject.")
    .max(200, "Subject must be under 200 characters."),
  organization: z
    .string()
    .trim()
    .max(150, "Organization name must be under 150 characters.")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .max(30, "Phone number must be under 30 characters.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Please provide details regarding your inquiry (minimum 10 characters).")
    .max(3000, "Message must not exceed 3000 characters."),
  sourceForm: z
    .string()
    .trim()
    .max(50)
    .optional(),
  hp_website: z
    .string()
    .max(100)
    .optional()
    .or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const adminInquiryUpdateSchema = z
  .object({
    status: z
      .enum(["NEW", "IN_PROGRESS", "AWAITING_RESPONSE", "RESOLVED", "SPAM", "ARCHIVED"])
      .optional(),
    priority: z
      .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
      .optional(),
    assignedToId: z
      .string()
      .cuid("Invalid administrator identifier format.")
      .nullable()
      .optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field (status, priority, or assignedToId) must be provided for update."
  );

export const adminInquiryNoteSchema = z
  .object({
    content: z
      .string()
      .trim()
      .min(2, "Note must be at least 2 characters long.")
      .max(2500, "Note must not exceed 2500 characters."),
  })
  .strict();

export const adminInquiryReplySchema = z
  .object({
    content: z
      .string()
      .trim()
      .min(10, "Reply content must be at least 10 characters.")
      .max(10000, "Reply content must not exceed 10,000 characters.")
      .optional(),
    subject: z
      .string()
      .trim()
      .max(250, "Subject must not exceed 250 characters.")
      .optional(),
    clientToken: z
      .string()
      .trim()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        "Client idempotency token must be a valid RFC 4122 UUID v4."
      )
      .optional(),
    preview: z.boolean().optional(),
    action: z.enum(["reply", "retry"]).optional(),
    replyId: z.string().optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.action === "retry") {
        return Boolean(data.replyId);
      }
      if (data.preview === true) {
        return Boolean(data.content && data.content.length >= 10);
      }
      return Boolean(
        data.content &&
        data.content.length >= 10 &&
        data.clientToken
      );
    },
    {
      message: "Reply content (min 10 chars) and clientToken (valid UUID v4) are required for reply submissions.",
    }
  );
