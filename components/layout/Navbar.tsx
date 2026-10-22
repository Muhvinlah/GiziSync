"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LogoutButton } from "@/components/logout-button";
import { Menu, X, HeartPulse } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/z-score", label: "Kalkulator Z-Score" },
  { href: "/recipes", label: "Resep Gizi Cerdas" },
  { href: "/children", label: "Data Balita" },
  { href: "/analytics", label: "Analitik Wilayah" },
];

export function Navbar({ userRole, userEmail }: { userRole?: string; userEmail?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "kader":
        return <span className="text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">Kader Posyandu</span>;
      case "nutritionist":
        return <span className="text-[11px] font-semibold bg-blue-500/15 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">Ahli Gizi Puskesmas</span>;
      case "parent":
        return <span className="text-[11px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">Orang Tua</span>;
      default:
        return <span className="text-[11px] font-semibold bg-primary/15 text-primary px-2 py-0.5 rounded-full border border-primary/30">Demo User</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <Link href="/z-score" className="flex items-center gap-2 font-bold text-base tracking-tight text-foreground hover:opacity-90">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span>Gizi<span className="text-emerald-600 dark:text-emerald-400">Sync</span></span>
          </Link>

          {/* Nav Links Desktop */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Status & Actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 text-xs">
            {getRoleBadge(userRole)}
            {userEmail && <span className="text-muted-foreground font-mono text-[11px]">{userEmail}</span>}
          </div>

          <ThemeSwitcher />

          <div className="hidden sm:block">
            <LogoutButton />
          </div>

          {/* Tombol Hamburger Mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden h-8 w-8 p-0"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigasi Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t p-4 space-y-3 bg-background">
          <nav className="flex flex-col gap-1 text-sm font-medium">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`p-2 rounded-md ${
                  pathname === item.href ? "bg-accent font-semibold text-accent-foreground" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t flex items-center justify-between">
            <div>{getRoleBadge(userRole)}</div>
            <LogoutButton />
          </div>
        </div>
      )}
    </header>
  );
}
