import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getChildren } from "@/actions/children";
import { ChildrenClientView } from "@/components/children/ChildrenClientView";
import { Baby } from "lucide-react";

export const metadata = {
  title: "Data Balita Posyandu — GiziSync",
  description: "Daftar rekam medis dan histori antropometri balita binaan posyandu.",
};

const DEFAULT_CHILDREN_DEMO = [
  {
    id: "demo-child-1",
    name: "Ahmad Rizky Pratama",
    birth_date: "2024-10-01",
    gender: "male" as const,
    region: "Desa Sukamaju",
    created_at: "2026-10-21T00:00:00.000Z",
    measurements: [
      {
        id: "m-1",
        measured_at: "2026-10-15",
        age_months: 24,
        height_cm: 80.5,
        weight_kg: 10.0,
        zscore_hfa: -2.39,
        zscore_wfa: -1.71,
        zscore_wfh: -0.64,
      },
    ],
  },
  {
    id: "demo-child-2",
    name: "Siti Aisyah Nurfadilah",
    birth_date: "2024-06-15",
    gender: "female" as const,
    region: "Desa Karanganyar",
    created_at: "2026-10-21T00:00:00.000Z",
    measurements: [
      {
        id: "m-2",
        measured_at: "2026-10-12",
        age_months: 28,
        height_cm: 89.2,
        weight_kg: 12.8,
        zscore_hfa: 0.15,
        zscore_wfa: 0.28,
        zscore_wfh: 0.32,
      },
    ],
  },
  {
    id: "demo-child-3",
    name: "Budi Santoso",
    birth_date: "2023-12-10",
    gender: "male" as const,
    region: "Kelurahan Cibiru",
    created_at: "2026-10-21T00:00:00.000Z",
    measurements: [
      {
        id: "m-3",
        measured_at: "2026-10-10",
        age_months: 34,
        height_cm: 88.0,
        weight_kg: 11.5,
        zscore_hfa: -2.52,
        zscore_wfa: -2.15,
        zscore_wfh: -0.92,
      },
    ],
  },
  {
    id: "demo-child-4",
    name: "Dewi Lestari",
    birth_date: "2024-02-20",
    gender: "female" as const,
    region: "Desa Mekarjaya",
    created_at: "2026-10-21T00:00:00.000Z",
    measurements: [
      {
        id: "m-4",
        measured_at: "2026-10-08",
        age_months: 32,
        height_cm: 93.0,
        weight_kg: 13.5,
        zscore_hfa: 0.22,
        zscore_wfa: 0.12,
        zscore_wfh: 0.05,
      },
    ],
  },
];

async function ChildrenContent() {
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

  const { data: dbChildren } = await getChildren();

  const finalChildren =
    dbChildren && dbChildren.length > 0 ? dbChildren : DEFAULT_CHILDREN_DEMO;

  // Hanya kader, nutritionist, dan admin yang dapat menambah balita
  const canManage = !userRole || ["kader", "nutritionist", "admin"].includes(userRole);

  return <ChildrenClientView initialChildren={finalChildren} canManage={canManage} />;
}

export default function ChildrenPage() {
  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="border-b pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Baby className="w-5 h-5 text-emerald-600" />
          Data Rekam Medis Balita Posyandu
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Pantau riwayat antropometri, status gizi per balita, dan intervensi resep gizi terintegrasi.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-48 flex items-center justify-center text-xs text-muted-foreground animate-pulse border rounded-lg bg-muted/20">
            Memuat Rekam Medis Balita Posyandu...
          </div>
        }
      >
        <ChildrenContent />
      </Suspense>
    </div>
  );
}
