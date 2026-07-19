"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Providers } from "./Providers";
import { AdminShell } from "./AdminShell";

export function AdminLayoutClient({
  children,
  authEnabled,
}: {
  children: ReactNode;
  authEnabled: boolean;
}) {
  const pathname = usePathname();
  const bare = pathname?.startsWith("/admin/login");

  return (
    <Providers>
      {bare ? children : <AdminShell authEnabled={authEnabled}>{children}</AdminShell>}
    </Providers>
  );
}
