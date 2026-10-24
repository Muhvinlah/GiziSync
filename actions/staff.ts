"use server";

import { createClient } from "@/lib/supabase/server";
import { staffUserSchema, StaffUserFormData } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export interface StaffProfile {
  id: string;
  full_name: string | null;
  role: "admin" | "nutritionist" | "kader" | "parent";
  created_at: string;
}

/**
 * Mendapatkan role pengguna yang sedang login saat ini
 */
export async function getCurrentUserRole(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    return profile?.role || (user.user_metadata?.role as string) || null;
  } catch {
    return null;
  }
}

/**
 * Mengambil daftar staf (kader, nutritionist, admin) - Khusus untuk role Admin
 */
export async function getStaffList(): Promise<{
  data: StaffProfile[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { data: [], error: "Sesi login tidak valid. Silakan login kembali." };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const userRole = profile?.role || (user.user_metadata?.role as string);

    if (userRole !== "admin") {
      return { data: [], error: "Akses ditolak: Hanya Administrator yang berhak mengakses data staf." };
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, role, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data as StaffProfile[]) || [] };
  } catch (err: unknown) {
    return {
      data: [],
      error: err instanceof Error ? err.message : "Gagal memuat daftar staf",
    };
  }
}

/**
 * Mendaftarkan akun petugas (Kader Posyandu atau Ahli Gizi) baru oleh Admin
 */
export async function createStaffAccount(data: StaffUserFormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user: currentUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !currentUser) {
      return { success: false, error: "Silakan login sebagai Administrator terlebih dahulu." };
    }

    // Pastikan pemanggil adalah role admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .maybeSingle();

    const currentRole = profile?.role || (currentUser.user_metadata?.role as string);

    if (currentRole !== "admin") {
      return {
        success: false,
        error: "Akses ditolak: Hanya Administrator yang berhak membuat akun petugas posyandu / puskesmas.",
      };
    }

    const validated = staffUserSchema.parse(data);

    // Buat akun di Supabase Auth dengan metadata nama & role
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          full_name: validated.fullName,
          role: validated.role,
        },
      },
    });

    if (signUpError) {
      return { success: false, error: signUpError.message };
    }

    const newUserId = signUpData.user?.id;
    if (newUserId) {
      // Pastikan record profil terisi sesuai peran yang ditentukan
      await supabase.from("profiles").upsert({
        id: newUserId,
        full_name: validated.fullName,
        role: validated.role,
      });
    }

    revalidatePath("/admin/users");
    return {
      success: true,
      message: `Akun ${validated.role === "nutritionist" ? "Ahli Gizi" : "Kader Posyandu"} berhasil didaftarkan.`,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Terjadi kesalahan sistem saat membuat akun staf",
    };
  }
}
