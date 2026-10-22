import { Suspense } from "react";
import { connection } from "next/server";
import { getChildById } from "@/actions/children";
import { generateSmartRecipes, DeficitCondition } from "@/lib/recipe-engine";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Sparkles, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Resep Gizi Cerdas Berbasis Pasar — GiziSync",
  description: "Rekomendasi menu pangan lokal padat gizi ekonomis untuk intervensi stunting dan wasting.",
};

async function RecipesContent({
  searchParams,
}: {
  searchParams: Promise<{ child_id?: string; category?: string }>;
}) {
  await connection();
  const resolvedParams = await searchParams;
  const childId = resolvedParams.child_id;

  let condition: DeficitCondition | undefined = undefined;
  let childName = "";
  let latestMeasurement: any = null;

  if (childId) {
    const { data: child } = await getChildById(childId);
    if (child) {
      childName = child.name;
      const measurements = child.measurements || [];
      if (measurements.length > 0) {
        latestMeasurement = measurements[measurements.length - 1];
        condition = {
          child_name: child.name,
          is_stunted: (latestMeasurement.zscore_hfa ?? 0) < -2,
          is_underweight: (latestMeasurement.zscore_wfa ?? 0) < -2,
          is_wasted: (latestMeasurement.zscore_wfh ?? 0) < -2,
        };
      }
    }
  }

  const recipes = generateSmartRecipes(condition);

  return (
    <div className="space-y-6">
      {/* Banner Rekomendasi Terpersonalisasi Balita (Jika dipicu dari Kalkulator) */}
      {condition && (
        <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-semibold text-xs text-foreground">
                Rekomendasi Menu Terarah untuk {childName}
              </span>
            </div>
            <Link href="/z-score">
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                Kembali ke Kalkulator
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            Berdasarkan rekam medis antropometri terakhir, menu diurutkan untuk memprioritaskan pemulihan defisit gizi:
          </p>

          <div className="flex items-center gap-2 flex-wrap pt-1">
            {condition.is_stunted && (
              <Badge className="bg-red-600 text-white text-[10px]">
                Prioritas: Protein Hewani, Zat Besi & Zink (Stunting)
              </Badge>
            )}
            {condition.is_wasted && (
              <Badge className="bg-amber-600 text-white text-[10px]">
                Prioritas: Makanan Padat Kalori & Lemak Sehat (Wasting)
              </Badge>
            )}
            {condition.is_underweight && (
              <Badge className="bg-yellow-600 text-white text-[10px]">
                Prioritas: Kalori & Protein Bertahap (Underweight)
              </Badge>
            )}
            {!condition.is_stunted && !condition.is_wasted && !condition.is_underweight && (
              <Badge className="bg-emerald-600 text-white text-[10px]">
                Pertahankan Gizi Seimbang & Variasi Pangan
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Daftar Kartu Resep Gizi Cerdas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ child_id?: string; category?: string }>;
}) {
  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
            Resep Gizi Cerdas Berbasis Pasar Hari Ini
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Menu presisi tinggi nutrisi, bahan lokal terjangkau (&lt; Rp6.000/porsi), dan teruji klinis.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border w-fit">
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Harga Pangan Lokal Terintegrasi</span>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="h-64 flex items-center justify-center text-xs text-muted-foreground animate-pulse border rounded-lg bg-muted/20">
            Meracik Menu Resep Gizi Berdasarkan Pasar...
          </div>
        }
      >
        <RecipesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
