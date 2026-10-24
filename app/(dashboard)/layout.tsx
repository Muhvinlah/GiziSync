import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { OfflineBanner } from "@/components/layout/OfflineBanner";

async function getDashboardUserInfo() {
  await connection();
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
    userRole = profile?.role || (user.user_metadata?.role as string);
  }
  return { userRole, userEmail: user?.email };
}

async function NavbarContainer() {
  const { userRole, userEmail } = await getDashboardUserInfo();
  return <Navbar userRole={userRole} userEmail={userEmail} />;
}

async function SidebarContainer() {
  const { userRole } = await getDashboardUserInfo();
  return <Sidebar userRole={userRole} />;
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
        <NavbarContainer />
      </Suspense>

      {/* Konten Utama dengan Sidebar Responsif */}
      <div className="flex-1 flex">
        <Suspense fallback={<aside className="hidden lg:flex w-64 border-r bg-card p-4 min-h-[calc(100vh-3.5rem)] shrink-0" />}>
          <SidebarContainer />
        </Suspense>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
