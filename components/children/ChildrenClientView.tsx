"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { childSchema, ChildFormData } from "@/lib/validators";
import { createChild, ChildWithLatestMeasurement } from "@/actions/children";
import { StatusBadge } from "@/components/z-score/StatusBadge";
import { classifyHfa, classifyWfa } from "@/lib/zscore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  UserPlus,
  Baby,
  Calendar,
  MapPin,
  Scale,
  UtensilsCrossed,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";

interface ChildrenClientViewProps {
  initialChildren: ChildWithLatestMeasurement[];
}

export function ChildrenClientView({ initialChildren }: ChildrenClientViewProps) {
  const [childrenList, setChildrenList] = useState<ChildWithLatestMeasurement[]>(initialChildren);
  const [showAddForm, setShowAddForm] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChildFormData>({
    resolver: zodResolver(childSchema),
    defaultValues: {
      name: "",
      birth_date: new Date().toISOString().split("T")[0],
      gender: "male",
      region: "Desa Sukamaju",
    },
  });

  const onSubmit = (data: ChildFormData) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await createChild(data);
      if (res.success && res.data) {
        setChildrenList([res.data, ...childrenList]);
        setFeedback({
          type: "success",
          message: `Balita ${res.data.name} berhasil didaftarkan!`,
        });
        reset();
        setShowAddForm(false);
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Gagal mendaftarkan balita",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Baris Tombol Aksi & Pencarian */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          Menampilkan <span className="font-semibold text-foreground">{childrenList.length}</span> balita terdaftar
        </span>

        <Button
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? (
            <>
              <X className="w-3.5 h-3.5" />
              Batal
            </>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5" />
              Daftarkan Balita Baru
            </>
          )}
        </Button>
      </div>

      {/* Formulir Pendaftaran Balita Baru */}
      {showAddForm && (
        <Card className="border shadow-sm bg-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Baby className="w-4 h-4 text-primary" />
              Formulir Pendaftaran Balita Posyandu
            </CardTitle>
            <CardDescription className="text-xs">
              Mendaftarkan data induk balita untuk pemantauan kurva pertumbuhan rutin
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nama Lengkap Balita</Label>
                <Input id="name" placeholder="misal: Siti Rahma" {...register("name")} className="h-9 text-xs" />
                {errors.name && <p className="text-destructive text-[11px]">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="birth_date">Tanggal Lahir</Label>
                <Input id="birth_date" type="date" {...register("birth_date")} className="h-9 text-xs" />
                {errors.birth_date && <p className="text-destructive text-[11px]">{errors.birth_date.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="gender">Jenis Kelamin</Label>
                <select
                  id="gender"
                  {...register("gender")}
                  className="w-full h-9 px-3 rounded-md border bg-background text-foreground text-xs"
                >
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="region">Wilayah / Desa / RW</Label>
                <Input id="region" placeholder="misal: Desa Sukamaju" {...register("region")} className="h-9 text-xs" />
                {errors.region && <p className="text-destructive text-[11px]">{errors.region.message}</p>}
              </div>

              <div className="sm:col-span-2 pt-2 flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setShowAddForm(false)}>
                  Batal
                </Button>
                <Button type="submit" size="sm" className="h-8 text-xs gap-1.5" disabled={isPending}>
                  {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Simpan Data Balita
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {feedback && (
        <div
          className={`p-3 rounded-md text-xs border flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 border-emerald-500/30"
              : "bg-destructive/10 text-destructive border-destructive/20"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Grid Kartu Balita */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {childrenList.map((child) => {
          const latest = child.measurements && child.measurements.length > 0
            ? child.measurements[child.measurements.length - 1]
            : null;

          return (
            <Card key={child.id} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{child.name}</span>
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                        {child.gender === "male" ? "Laki-laki" : "Perempuan"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Lahir: {child.birth_date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {child.region}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Pengukuran Terakhir */}
                <div className="p-2.5 rounded-lg bg-muted/40 border text-xs space-y-2">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                    Pengukuran Terakhir: {latest ? `${latest.measured_at} (${latest.age_months} bln)` : "Belum diukur"}
                  </span>

                  {latest ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span>TB: {latest.height_cm} cm</span>
                        <span>BB: {latest.weight_kg} kg</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <StatusBadge
                          type="hfa"
                          status={classifyHfa(latest.zscore_hfa)}
                          zscore={latest.zscore_hfa}
                          showScore={false}
                        />
                        <StatusBadge
                          type="wfa"
                          status={classifyWfa(latest.zscore_wfa)}
                          zscore={latest.zscore_wfa}
                          showScore={false}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted-foreground italic">
                      Belum ada catatan antropometri. Klik catat untuk memulai.
                    </p>
                  )}
                </div>

                {/* Tombol Aksi Pintas */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t text-xs">
                  <Link href={`/recipes?child_id=${child.id}`}>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      Resep Gizi
                    </Button>
                  </Link>

                  <Link href={`/z-score`}>
                    <Button size="sm" className="h-7 text-xs gap-1">
                      <Scale className="w-3.5 h-3.5" />
                      Catat Ukur
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
