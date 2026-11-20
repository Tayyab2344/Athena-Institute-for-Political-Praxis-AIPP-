import { redirect } from "next/navigation";
import { AdminRole } from "@prisma/client";
import { ShieldAlert } from "lucide-react";
import { getAdminSessionFromCookies } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import MediaLibraryClient from "@/components/admin/media/MediaLibraryClient";

export const metadata = {
  title: "Media Library | AIPP Admin",
  description:
    "Manage the images and documents used across AIPP's publications, journals, research, and institutional content."
};

export default async function AdminMediaPage() {
  const sessionData = await getAdminSessionFromCookies();
  if (!sessionData) {
    redirect("/admin/login?from=/admin/media");
  }

  const { user } = sessionData;
  const canViewMedia = hasPermission(user.role, "view_media");

  if (!canViewMedia) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white border border-[#D9DEE2] rounded-xl p-6 sm:p-8 flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-[#B09C4B] shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h1 className="font-serif text-xl sm:text-2xl font-medium text-[#081D2E]">
              Access Restricted
            </h1>
            <p className="text-xs sm:text-sm font-sans text-[#64717C] leading-relaxed">
              Your account role (<span className="font-mono text-[#081D2E]">{user.role}</span>) does not have permission to access the Media Library. Media archive management is restricted to Editors and Super Administrators.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const canUpload = hasPermission(user.role, "upload_files");
  const canReconcile =
    user.role === AdminRole.SUPER_ADMIN && hasPermission(user.role, "manage_security");

  return <MediaLibraryClient canUpload={canUpload} canReconcile={canReconcile} />;
}

