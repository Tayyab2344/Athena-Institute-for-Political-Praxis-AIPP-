import { z } from "zod";

export const newsletterSubscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .min(5, "Email address is required.")
    .max(150, "Email address must not exceed 150 characters.")
    .email("Please provide a valid institutional or personal email address.")
    .refine((val) => !/[\r\n]/.test(val), "Email must not contain newline characters."),
  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must affirmatively consent to receive institutional communications.",
    }),
  source: z
    .string()
    .trim()
    .max(50, "Source must not exceed 50 characters.")
    .optional()
    .default("FOOTER"),
  hp_organization: z
    .string()
    .max(100)
    .optional()
    .or(z.literal("")),
  hp_website: z
    .string()
    .max(100)
    .optional()
    .or(z.literal("")),
});

export const newsletterVerifySchema = z.object({
  token: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{64}$/, "Invalid verification token format."),
  action: z.enum(["preview", "confirm"]).optional().default("confirm"),
});

export const newsletterResendSchema = z.object({
  email: z
    .string()
    .trim()
    .min(5, "Email address is required.")
    .max(150, "Email address must not exceed 150 characters.")
    .email("Please provide a valid institutional or personal email address.")
    .refine((val) => !/[\r\n]/.test(val), "Email must not contain newline characters."),
  hp_organization: z
    .string()
    .max(100)
    .optional()
    .or(z.literal("")),
  hp_website: z
    .string()
    .max(100)
    .optional()
    .or(z.literal("")),
});

export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;
export type NewsletterVerifyInput = z.infer<typeof newsletterVerifySchema>;
export type NewsletterResendInput = z.infer<typeof newsletterResendSchema>;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
