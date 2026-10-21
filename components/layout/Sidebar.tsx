"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, UtensilsCrossed, Baby, BarChart3, WifiOff } from "lucide-react";

const SIDEBAR_NAV = [
  {
    href: "/z-score",
    label: "Kalkulator Z-Score",
    icon: Calculator,
    desc: "Input antropometri & kurva WHO",
  },
  {
    href: "/recipes",
    label: "Resep Gizi Cerdas",
    icon: UtensilsCrossed,
    desc: "Menu pangan lokal ekonomis",
  },
  {
    href: "/children",
    label: "Data Balita",
    icon: Baby,
    desc: "Daftar rekam medis balita",
  },
  {
    href: "/analytics",
    label: "Analitik Wilayah",
    icon: BarChart3,
    desc: "Sebaran stunting per desa",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-card p-4 space-y-6 shrink-0 min-h-[calc(100vh-3.5rem)]">
      <div className="space-y-1">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3">
          Menu Utama Posyandu
        </span>
        <nav className="space-y-1 pt-1">
          {SIDEBAR_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-start gap-3 p-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="font-semibold">{item.label}</div>
                  <div className={`text-[10px] line-clamp-1 ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {item.desc}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Info Ketahanan Mode Offline */}
      <div className="mt-auto p-3 rounded-lg border bg-muted/40 text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-foreground text-[11px]">
          <WifiOff className="w-3.5 h-3.5 text-amber-500" />
          <span>Kesiapan Mode Luring</span>
        </div>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Sistem GiziSync mendukung pencatatan di daerah susah sinyal. Data tersimpan di peramban dan dapat disinkronkan kapan saja.
        </p>
      </div>
    </aside>
  );
}
