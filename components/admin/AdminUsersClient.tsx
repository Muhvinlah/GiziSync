"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffUserSchema, StaffUserFormData } from "@/lib/validators";
import { createStaffAccount, StaffProfile } from "@/actions/staff";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  User,
  Users,
} from "lucide-react";

interface AdminUsersClientProps {
  initialStaffList: StaffProfile[];
}

export function AdminUsersClient({ initialStaffList }: AdminUsersClientProps) {
  const [staffList, setStaffList] = useState<StaffProfile[]>(initialStaffList);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StaffUserFormData>({
    resolver: zodResolver(staffUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "kader",
    },
  });

  const onSubmit = (formData: StaffUserFormData) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await createStaffAccount(formData);
      if (res.success) {
        setFeedback({
          type: "success",
          message: res.message || "Akun petugas berhasil dibuat!",
        });
        // Perbarui daftar staf lokal secara optimistik
        setStaffList((prev) => [
          {
            id: `temp-${Date.now()}`,
            full_name: formData.fullName,
            role: formData.role,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        reset();
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Gagal membuat akun petugas",
        });
      }
    });
  };

  const getRoleBadge = (role: StaffProfile["role"]) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30 font-semibold gap-1">
            <ShieldCheck className="w-3 h-3" /> Administrator
          </Badge>
        );
      case "nutritionist":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 font-semibold gap-1">
            <Stethoscope className="w-3 h-3" /> Ahli Gizi Puskesmas
          </Badge>
        );
      case "kader":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-semibold gap-1">
            <UserCheck className="w-3 h-3" /> Kader Posyandu
          </Badge>
        );
      default:
        return <Badge variant="secondary">Pengguna</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Kolom Kiri: Form Registrasi Petugas Baru */}
      <Card className="lg:col-span-1 shadow-sm border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-rose-600" />
            Tambah Petugas Baru
          </CardTitle>
          <CardDescription className="text-xs">
            Daftarkan akun staf resmi untuk Kader Posyandu atau Tenaga Pelaksana Gizi (TPG).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedback && (
            <div
              className={`mb-4 p-3 rounded-lg text-xs flex items-start gap-2 border ${
                feedback.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                  : "bg-destructive/10 border-destructive/30 text-destructive"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-semibold">
                Nama Lengkap &amp; Gelar
              </Label>
              <div className="relative">
                <User className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <Input
                  id="fullName"
                  placeholder="Contoh: Bidan Siti Rahmawati, A.Md.Keb"
                  className="pl-9 text-xs"
                  {...register("fullName")}
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Alamat Email Kedinasan / Akun
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="petugas@gizisync.id"
                  className="pl-9 text-xs"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold">
                Kata Sandi Awal
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  className="pl-9 text-xs"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs font-semibold">
                Peran &amp; Hak Akses Aplikasi
              </Label>
              <select
                id="role"
                {...register("role")}
                className="w-full text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="kader">Kader Posyandu (Input Pengukuran, Rekam Balita)</option>
                <option value="nutritionist">Ahli Gizi Puskesmas (Analitik Wilayah, Intervensi Resep)</option>
              </select>
              {errors.role && (
                <p className="text-[11px] text-destructive">{errors.role.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Mendaftarkan Petugas...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Daftarkan Akun Petugas
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Kolom Kanan: Tabel Staf Terdaftar */}
      <Card className="lg:col-span-2 shadow-sm border">
        <CardHeader className="space-y-1 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Daftar Petugas &amp; Staf Terdaftar
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {staffList.length} Petugas
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Daftar seluruh akun yang memiliki hak input dan pengelolaan program stunting di GiziSync.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {staffList.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground border rounded-lg bg-muted/20">
              Belum ada staf terdaftar di database. Gunakan formulir di sebelah kiri untuk menambahkan.
            </div>
          ) : (
            <div className="divide-y border rounded-lg overflow-hidden bg-card">
              {staffList.map((staff) => (
                <div
                  key={staff.id}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="font-semibold text-xs text-foreground flex items-center gap-2 flex-wrap">
                      <span>{staff.full_name || "Petugas Lapangan"}</span>
                      {getRoleBadge(staff.role)}
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground truncate">
                      ID: {staff.id}
                    </div>
                  </div>
                  <div className="text-[11px] text-muted-foreground whitespace-nowrap self-start sm:self-auto">
                    Terdaftar:{" "}
                    {new Date(staff.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
