import type { Metadata } from "next";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export const metadata: Metadata = {
  title: "Espace Barber",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const authEnabled = process.env.ADMIN_AUTH_ENABLED === "true";
  return (
    <AdminLayoutClient authEnabled={authEnabled}>{children}</AdminLayoutClient>
  );
}
