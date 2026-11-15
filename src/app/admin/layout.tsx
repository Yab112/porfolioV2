import type { Metadata } from "next";
import { AdminNav } from "./_nav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl pb-16">
      <AdminNav />
      {children}
    </div>
  );
}
