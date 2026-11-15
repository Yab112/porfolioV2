import type { Metadata } from "next";
import { AdminNav } from "./_nav";
import { AdminQueryProvider } from "./_query";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminQueryProvider>
      <div className="mx-auto w-full max-w-6xl pb-16">
        <AdminNav />
        {children}
      </div>
    </AdminQueryProvider>
  );
}
