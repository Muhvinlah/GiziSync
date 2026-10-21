import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { OfflineBanner } from "@/components/layout/OfflineBanner";

async function NavbarWrapper() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRole: string | undefined = undefined;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    userRole = profile?.role;
  }

  return <Navbar userRole={userRole} userEmail={user?.email} />;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Banner Notifikasi Mode Offline & Sinkronisasi */}
      <OfflineBanner />

      {/* Header / Navbar Global dengan batas Suspense */}
      <Suspense fallback={<header className="h-14 border-b bg-background/95 w-full" />}>
        <NavbarWrapper />
      </Suspense>

      {/* Konten Utama dengan Sidebar Responsif */}
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
