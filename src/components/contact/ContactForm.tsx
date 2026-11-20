"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2, ArrowUpRight, RotateCcw } from "lucide-react";
import { INQUIRY_TYPES, ContactFormData } from "@/lib/validations/contact";

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  organization?: string;
  message?: string;
  general?: string;
}

interface SubmissionSuccessData {
  referenceId: string;
  name: string;
  email: string;
  subject: string;
  receivedAt: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: INQUIRY_TYPES[0],
    organization: "",
    message: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<SubmissionSuccessData | null>(null);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  // Client-side validator
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Full name must be at least 2 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Institutional or personal email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please provide a valid email address.";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Please select an inquiry type.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message details are required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Please provide at least 10 characters detailing your inquiry.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: keyof ContactFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiErrorMessage(null);

    // Mark all as touched
    setTouched({
      name: true,
      email: true,
      subject: true,
      organization: true,
      message: true,
    });

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          organization: formData.organization?.trim() || undefined,
          message: formData.message.trim(),
          sourceForm: "CONTACT_PAGE",
          hp_website: "",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.fieldErrors) {
          const fieldErrMap: FormErrors = {};
          if (data.fieldErrors.name) fieldErrMap.name = data.fieldErrors.name[0];
          if (data.fieldErrors.email) fieldErrMap.email = data.fieldErrors.email[0];
          if (data.fieldErrors.subject) fieldErrMap.subject = data.fieldErrors.subject[0];
          if (data.fieldErrors.message) fieldErrMap.message = data.fieldErrors.message[0];
          setErrors(fieldErrMap);
        }
        throw new Error(data.error || "Unable to submit your inquiry at this moment.");
      }

      // Success confirmed by server
      setSubmissionSuccess({
        referenceId: data.referenceId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        receivedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected network error occurred. Please try again or reach out to contact@aipp-praxis.org.";
      setApiErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      subject: INQUIRY_TYPES[0],
      organization: "",
      message: "",
    });
    setTouched({});
    setErrors({});
    setSubmissionSuccess(null);
    setApiErrorMessage(null);
  };

  const handleOpenMailto = () => {
    const subject = encodeURIComponent(`[AIPP Inquiry: ${formData.subject}] from ${formData.name}`);
    const body = encodeURIComponent(
      `Official Inquiry to Athena Institute for Political Praxis\n\nName: ${formData.name}\nEmail: ${formData.email}\nOrganization: ${formData.organization || "N/A"}\nInquiry Type: ${formData.subject}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:contact@aipp-praxis.org?subject=${subject}&body=${body}`;
  };

  /* ═══ Success Confirmation Screen ═══ */
  if (submissionSuccess) {
    return (
      <div 
        className="bg-white border border-[#D9DEE2] rounded-3xl p-8 sm:p-12 shadow-xs transition-all animate-in fade-in duration-300"
        role="region"
        aria-live="polite"
      >
        <div className="text-center space-y-6 max-w-xl mx-auto">
          {/* Badge Icon */}
          <div className="w-16 h-16 rounded-full bg-[#FAF9F5] border border-[#B09C4B]/40 flex items-center justify-center text-[#B09C4B] mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span
              className="text-xs font-semibold uppercase tracking-wider text-[#B09C4B] block"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Inquiry Formally Registered
            </span>
            <h3
              className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#0D2C49] tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Thank You, {submissionSuccess.name}
            </h3>
            <p
              className="text-sm sm:text-base text-[#243748] leading-relaxed pt-1"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Your transmission regarding <strong className="font-semibold text-[#0D2C49]">{submissionSuccess.subject}</strong> has been received and logged by the AIPP External Affairs Secretariat.
            </p>
          </div>

          {/* Institutional Receipt Card */}
          <div className="bg-[#FAF9F5] border border-[#D9DEE2] rounded-2xl p-5 text-left text-xs sm:text-sm space-y-2.5">
            <div className="flex justify-between items-center border-b border-[#D9DEE2]/60 pb-2">
              <span className="text-[#64717C] uppercase tracking-wider text-[11px] font-medium">Tracking Reference</span>
              <span className="font-mono font-bold text-[#0D2C49] tracking-wider">{submissionSuccess.referenceId}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#D9DEE2]/60 pb-2">
              <span className="text-[#64717C] uppercase tracking-wider text-[11px] font-medium">Recipient Desk</span>
              <span className="font-medium text-[#0D2C49]">AIPP External Affairs Taskforce</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#64717C] uppercase tracking-wider text-[11px] font-medium">Routing Contact</span>
              <span className="font-medium text-[#0D2C49]">{submissionSuccess.email}</span>
            </div>
          </div>

          <p className="text-xs text-[#64717C] leading-relaxed">
            Our directorate reviews submissions within 2 to 3 business days. A copy of your submission tracking code has been recorded.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-full border border-[#0D2C49] bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-[#0D2C49] hover:bg-[#FAF9F5] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Submit Another Inquiry</span>
            </button>

            <button
              type="button"
              onClick={handleOpenMailto}
              className="inline-flex items-center gap-2 rounded-full bg-[#0D2C49] px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-[#081D2E] transition-colors shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
            >
              <span>Open in Email Client</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ═══ Active Submission Form ═══ */
  return (
    <div className="bg-white border border-[#D9DEE2] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs">
      <div className="space-y-3 mb-8">
        <span
          className="text-xs font-semibold uppercase tracking-wider text-[#B09C4B] block"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Direct Transmission
        </span>
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#0D2C49] tracking-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Send an Official Inquiry
        </h2>
        <p
          className="text-sm sm:text-base text-[#243748] font-normal leading-relaxed"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Please provide your details below. Fields marked with an asterisk (<span className="text-[#0D2C49] font-bold">*</span>) are required.
        </p>
      </div>

      {/* Server Error Alert */}
      {apiErrorMessage && (
        <div 
          className="mb-6 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-xs sm:text-sm text-red-800 flex items-start gap-3"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-semibold block">Submission Error</strong>
            <span>{apiErrorMessage}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Row 1: Full Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block text-xs sm:text-[0.8125rem] font-semibold text-[#0D2C49]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Full Name <span className="text-[#B09C4B] font-bold" aria-hidden="true">*</span>
              <span className="sr-only">(Required)</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              aria-required="true"
              aria-invalid={!!(touched.name && errors.name)}
              aria-describedby={touched.name && errors.name ? "name-error" : undefined}
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur("name")}
              placeholder="e.g. Ambassador Elena Rostova"
              disabled={isSubmitting}
              className={`w-full min-h-[46px] rounded-xl border px-4 py-2.5 text-sm text-[#081D2E] placeholder:text-[#64717C]/60 bg-[#FAF9F5] transition-colors focus:bg-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] ${
                touched.name && errors.name
                  ? "border-red-400 bg-red-50/20"
                  : "border-[#D9DEE2] hover:border-[#0D2C49]/40"
              }`}
            />
            {touched.name && errors.name && (
              <p id="name-error" className="text-xs text-red-600 font-medium pt-0.5">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs sm:text-[0.8125rem] font-semibold text-[#0D2C49]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Institutional or Personal Email <span className="text-[#B09C4B] font-bold" aria-hidden="true">*</span>
              <span className="sr-only">(Required)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              aria-required="true"
              aria-invalid={!!(touched.email && errors.email)}
              aria-describedby={touched.email && errors.email ? "email-error" : undefined}
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              placeholder="e.g. name@institution.org"
              disabled={isSubmitting}
              className={`w-full min-h-[46px] rounded-xl border px-4 py-2.5 text-sm text-[#081D2E] placeholder:text-[#64717C]/60 bg-[#FAF9F5] transition-colors focus:bg-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] ${
                touched.email && errors.email
                  ? "border-red-400 bg-red-50/20"
                  : "border-[#D9DEE2] hover:border-[#0D2C49]/40"
              }`}
            />
            {touched.email && errors.email && (
              <p id="email-error" className="text-xs text-red-600 font-medium pt-0.5">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Subject/Inquiry Type & Organization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* Inquiry Type */}
          <div className="space-y-1.5">
            <label
              htmlFor="subject"
              className="block text-xs sm:text-[0.8125rem] font-semibold text-[#0D2C49]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Subject / Inquiry Type <span className="text-[#B09C4B] font-bold" aria-hidden="true">*</span>
              <span className="sr-only">(Required)</span>
            </label>
            <div className="relative">
              <select
                id="subject"
                name="subject"
                required
                aria-required="true"
                value={formData.subject}
                onChange={handleChange}
                onBlur={() => handleBlur("subject")}
                disabled={isSubmitting}
                className="w-full min-h-[46px] appearance-none rounded-xl border border-[#D9DEE2] bg-[#FAF9F5] px-4 py-2.5 pr-10 text-sm text-[#081D2E] transition-colors focus:bg-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] hover:border-[#0D2C49]/40 cursor-pointer"
              >
                {INQUIRY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#64717C]">
                ▼
              </span>
            </div>
            {touched.subject && errors.subject && (
              <p className="text-xs text-red-600 font-medium pt-0.5">{errors.subject}</p>
            )}
          </div>

          {/* Organization / Affiliation */}
          <div className="space-y-1.5">
            <label
              htmlFor="organization"
              className="block text-xs sm:text-[0.8125rem] font-semibold text-[#0D2C49]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Organization / Affiliation <span className="text-[#64717C] font-normal text-xs">(Optional)</span>
            </label>
            <input
              id="organization"
              name="organization"
              type="text"
              value={formData.organization}
              onChange={handleChange}
              placeholder="e.g. Ministry, Embassy, Think Tank, University"
              disabled={isSubmitting}
              className="w-full min-h-[46px] rounded-xl border border-[#D9DEE2] bg-[#FAF9F5] px-4 py-2.5 text-sm text-[#081D2E] placeholder:text-[#64717C]/60 transition-colors focus:bg-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] hover:border-[#0D2C49]/40"
            />
          </div>
        </div>

        {/* Row 3: Message / Inquiry Statement */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="message"
              className="block text-xs sm:text-[0.8125rem] font-semibold text-[#0D2C49]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Message / Statement of Purpose <span className="text-[#B09C4B] font-bold" aria-hidden="true">*</span>
              <span className="sr-only">(Required)</span>
            </label>
            <span className="text-[11px] text-[#64717C]">
              {formData.message.length}/3000 chars
            </span>
          </div>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            aria-required="true"
            aria-invalid={!!(touched.message && errors.message)}
            aria-describedby={touched.message && errors.message ? "message-error" : undefined}
            value={formData.message}
            onChange={handleChange}
            onBlur={() => handleBlur("message")}
            placeholder="Please detail the context of your inquiry, delegation specifications, research proposal, or partnership objectives..."
            disabled={isSubmitting}
            className={`w-full rounded-2xl border px-4 py-3 text-sm text-[#081D2E] placeholder:text-[#64717C]/60 bg-[#FAF9F5] transition-colors focus:bg-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] resize-y min-h-[130px] ${
              touched.message && errors.message
                ? "border-red-400 bg-red-50/20"
                : "border-[#D9DEE2] hover:border-[#0D2C49]/40"
            }`}
          />
          {touched.message && errors.message && (
            <p id="message-error" className="text-xs text-red-600 font-medium pt-0.5">
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit Actions & Privacy Protocol */}
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#D9DEE2]/60">
          <p className="text-xs text-[#64717C] max-w-sm leading-relaxed">
            Submissions are transmitted securely to the AIPP Secretariat under diplomatic confidentiality protocols.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full bg-[#0D2C49] px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#081D2E] active:scale-[0.99] shadow-xs hover:shadow-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Transmitting Inquiry...</span>
              </>
            ) : (
              <>
                <span>Submit Inquiry</span>
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

