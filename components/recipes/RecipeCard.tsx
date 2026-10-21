"use client";

import { useState } from "react";
import { SmartRecipe } from "@/lib/recipe-engine";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Coins,
  ChefHat,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Printer,
} from "lucide-react";

interface RecipeCardProps {
  recipe: SmartRecipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3 border-b bg-card">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Badge
                variant="outline"
                className="mb-1.5 text-[11px] font-medium bg-primary/10 text-primary border-primary/20"
              >
                {recipe.category}
              </Badge>
              <CardTitle className="text-base font-bold text-foreground leading-snug">
                {recipe.title}
              </CardTitle>
              <CardDescription className="text-xs flex items-center gap-3 mt-1.5 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {recipe.preparationTime}
                </span>
                <span>•</span>
                <span>Usia {recipe.targetAge}</span>
              </CardDescription>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-muted-foreground block">Estimasi Biaya</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {formatRupiah(recipe.costPerServing)}
              </span>
              <span className="text-[10px] text-muted-foreground block">/ porsi</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4 text-xs">
          {/* Nilai Gizi & Pemenuhan AKG Harian */}
          <div className="space-y-2 p-3 rounded-lg bg-muted/40 border">
            <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Kandungan Nutrisi & % AKG Balita per Porsi
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
              <div className="p-2 rounded bg-background border">
                <span className="text-[10px] text-muted-foreground block">Protein</span>
                <span className="font-bold text-foreground text-xs">{recipe.nutrients.protein}g</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">
                  {recipe.akgPercentage.protein}% AKG
                </span>
              </div>
              <div className="p-2 rounded bg-background border">
                <span className="text-[10px] text-muted-foreground block">Zat Besi</span>
                <span className="font-bold text-foreground text-xs">{recipe.nutrients.iron}mg</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">
                  {recipe.akgPercentage.iron}% AKG
                </span>
              </div>
              <div className="p-2 rounded bg-background border">
                <span className="text-[10px] text-muted-foreground block">Zink</span>
                <span className="font-bold text-foreground text-xs">{recipe.nutrients.zinc}mg</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">
                  {recipe.akgPercentage.zinc}% AKG
                </span>
              </div>
              <div className="p-2 rounded bg-background border">
                <span className="text-[10px] text-muted-foreground block">Kalsium</span>
                <span className="font-bold text-foreground text-xs">{recipe.nutrients.calcium}mg</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">
                  {recipe.akgPercentage.calcium}% AKG
                </span>
              </div>
            </div>
          </div>

          {/* Bahan Pangan Lokal & Estimasi Biaya */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-foreground block">
              Bahan Pangan Lokal Terjangkau:
            </span>
            <ul className="space-y-1.5 text-[11px]">
              {recipe.ingredients.map((ing, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between p-1.5 rounded hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-foreground">{ing.name} ({ing.amount})</span>
                    {ing.isLocalHero && (
                      <Badge variant="secondary" className="text-[9px] py-0 px-1 bg-amber-500/15 text-amber-700 dark:text-amber-300">
                        Pangan Lokal
                      </Badge>
                    )}
                  </div>
                  <span className="text-muted-foreground font-mono">
                    {formatRupiah(ing.estimatedCost)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Langkah Memasak Praktis (Accordion Toggle) */}
          {showInstructions && (
            <div className="space-y-2 pt-2 border-t">
              <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5 text-primary" />
                Langkah Pengolahan Praktis (Higienis):
              </span>
              <ol className="space-y-1.5 text-[11px] text-muted-foreground list-decimal list-inside pl-1">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </CardContent>
      </div>

      <div className="p-3 bg-muted/20 border-t flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
          onClick={() => setShowInstructions(!showInstructions)}
        >
          {showInstructions ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              Tutup Langkah
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              Lihat Cara Masak
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1"
          onClick={() => window.print()}
          title="Cetak Resep ini untuk Orang Tua Balita"
        >
          <Printer className="w-3.5 h-3.5" />
          Cetak Resep
        </Button>
      </div>
    </Card>
  );
}
