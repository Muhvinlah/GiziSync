"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, AlertOctagon, TrendingUp, Info } from "lucide-react";
import { HfaStatus, WfaStatus, WfhStatus } from "@/lib/zscore";

interface StatusBadgeProps {
  type: "hfa" | "wfa" | "wfh";
  status: HfaStatus | WfaStatus | WfhStatus | string;
  zscore?: number;
  showScore?: boolean;
}

export function StatusBadge({ type, status, zscore, showScore = true }: StatusBadgeProps) {
  const getBadgeConfig = () => {
    // 1. Indikator TB/U (Stunting)
    if (type === "hfa") {
      if (status.includes("Sangat Pendek")) {
        return {
          label: "Sangat Pendek (Severely Stunted)",
          variant: "destructive",
          className: "bg-red-600 hover:bg-red-700 text-white border-red-700",
          icon: AlertOctagon,
        };
      }
      if (status.includes("Pendek")) {
        return {
          label: "Pendek (Stunted)",
          className: "bg-amber-500 hover:bg-amber-600 text-white border-amber-600",
          icon: AlertTriangle,
        };
      }
      if (status.includes("Normal")) {
        return {
          label: "Normal (TB/U)",
          className: "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700",
          icon: CheckCircle2,
        };
      }
      return {
        label: "Tinggi",
        className: "bg-blue-600 hover:bg-blue-700 text-white border-blue-700",
        icon: TrendingUp,
      };
    }

    // 2. Indikator BB/U (Underweight)
    if (type === "wfa") {
      if (status.includes("Sangat Kurang")) {
        return {
          label: "BB Sangat Kurang",
          variant: "destructive",
          className: "bg-red-600 hover:bg-red-700 text-white border-red-700",
          icon: AlertOctagon,
        };
      }
      if (status.includes("Kurang")) {
        return {
          label: "BB Kurang (Underweight)",
          className: "bg-amber-500 hover:bg-amber-600 text-white border-amber-600",
          icon: AlertTriangle,
        };
      }
      if (status.includes("Normal")) {
        return {
          label: "BB Normal",
          className: "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700",
          icon: CheckCircle2,
        };
      }
      return {
        label: "Risiko BB Lebih",
        className: "bg-sky-600 hover:bg-sky-700 text-white border-sky-700",
        icon: Info,
      };
    }

    // 3. Indikator BB/TB (Wasting)
    if (status.includes("Gizi Buruk")) {
      return {
        label: "Gizi Buruk (Severely Wasted)",
        variant: "destructive",
        className: "bg-red-600 hover:bg-red-700 text-white border-red-700",
        icon: AlertOctagon,
      };
    }
    if (status.includes("Gizi Kurang")) {
      return {
        label: "Gizi Kurang (Wasted)",
        className: "bg-amber-500 hover:bg-amber-600 text-white border-amber-600",
        icon: AlertTriangle,
      };
    }
    if (status.includes("Gizi Baik")) {
      return {
        label: "Gizi Baik (Normal)",
        className: "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700",
        icon: CheckCircle2,
      };
    }
    if (status.includes("Berisiko")) {
      return {
        label: "Berisiko Gizi Lebih",
        className: "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600",
        icon: Info,
      };
    }
    if (status.includes("Lebih")) {
      return {
        label: "Gizi Lebih (Overweight)",
        className: "bg-purple-600 hover:bg-purple-700 text-white border-purple-700",
        icon: TrendingUp,
      };
    }
    return {
      label: "Obesitas",
      className: "bg-purple-700 hover:bg-purple-800 text-white border-purple-800",
      icon: AlertOctagon,
    };
  };

  const { label, className, icon: Icon } = getBadgeConfig();

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border shadow-sm transition-all ${className}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{label}</span>
      {showScore && typeof zscore === "number" && (
        <span className="ml-1 opacity-90 font-mono text-[11px] bg-black/20 dark:bg-white/20 px-1 py-0.2 rounded">
          {zscore > 0 ? `+${zscore.toFixed(2)}` : zscore.toFixed(2)} SD
        </span>
      )}
    </Badge>
  );
}
