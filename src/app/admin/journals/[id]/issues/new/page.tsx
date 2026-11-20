import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { getAdminSessionFromCookies } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import AdminJournalIssueCreateClient from "@/components/admin/journals/AdminJournalIssueCreateClient";

export const metadata = {
  title: "New Journal Issue | AIPP Admin",
  description: "Create and compile a new academic journal issue."
};

export default async function AdminJournalIssueNewPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessionData = await getAdminSessionFromCookies();
  if (!sessionData) {
    redirect(`/admin/login?from=/admin/journals/${id}/issues/new`);
  }

  const { user } = sessionData;
  if (!hasPermission(user.role, "manage_journals")) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white border border-[#D9DEE2] rounded-xl p-6 sm:p-8 flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-[#B09C4B] shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h1 className="font-serif text-xl sm:text-2xl font-medium text-[#081D2E]">
              Access Restricted
            </h1>
            <p className="text-xs sm:text-sm font-sans text-[#64717C] leading-relaxed">
              Your account role (<span className="font-mono text-[#081D2E]">{user.role}</span>) does not have permission to manage Journals &amp; Issues.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <AdminJournalIssueCreateClient journalId={id} />;
}

