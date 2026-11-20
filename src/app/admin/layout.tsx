import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminStatus } from "@prisma/client";
import { getAdminSessionFromCookies } from "@/lib/auth/session";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "AIPP Admin Console | Athena Institute for Political Praxis",
  description: "Executive Content Management System and Administration Console for AIPP.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/logo.png" },
    ],
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const currentPath = headersList.get("x-admin-path") || "";

  // If rendering the login page, bypass the admin navigation shell
  if (currentPath.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  // Authoritative server-side session check for all protected admin pages
  const sessionData = await getAdminSessionFromCookies();
  if (!sessionData) {
    const fromParam = currentPath ? `?from=${encodeURIComponent(currentPath)}` : "";
    redirect(`/admin/login${fromParam}`);
  }

  const { user } = sessionData;

  // Verify status is ACTIVE
  if (user.status !== AdminStatus.ACTIVE) {
    redirect("/admin/login?error=account_unavailable");
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
