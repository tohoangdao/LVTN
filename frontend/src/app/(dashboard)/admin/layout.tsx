"use client";

import { ReactNode } from "react";
import AdminHeader from "@/components/layout/AdminHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col overflow-x-hidden text-textPrimary min-h-screen">
      <AdminHeader />
      <div className="bg-bgTertiary p-4 flex-1">{children}</div>
    </div>
  );
}