"use server";

import { createClient } from "@/lib/supabase/server";
import { childSchema, ChildFormData } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export interface ChildWithLatestMeasurement {
  id: string;
  name: string;
  birth_date: string;
  gender: "male" | "female";
  region: string;
  created_at: string;
  measurements?: Array<{
    id: string;
    measured_at: string;
    age_months: number;
    height_cm: number;
    weight_kg: number;
    zscore_hfa: number;
    zscore_wfa: number;
    zscore_wfh: number;
  }>;
}

export async function getChildren(): Promise<{
  data: ChildWithLatestMeasurement[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("children")
      .select("*, measurements(*)")
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: data || [] };
  } catch (err: unknown) {
    return {
      data: [],
      error: err instanceof Error ? err.message : "Gagal mengambil data anak",
    };
  }
}

export async function getChildById(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("children")
      .select("*, measurements(*)")
      .eq("id", id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Gagal mengambil data anak",
    };
  }
}

export async function createChild(data: ChildFormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Silakan login terlebih dahulu" };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role && !["kader", "nutritionist", "admin"].includes(profile.role)) {
      return {
        success: false,
        error: "Hanya Kader Posyandu, Ahli Gizi, atau Administrator yang diizinkan mendaftarkan balita.",
      };
    }

    const validated = childSchema.parse(data);
    const { data: inserted, error: insertError } = await supabase
      .from("children")
      .insert({
        name: validated.name,
        birth_date: validated.birth_date,
        gender: validated.gender,
        region: validated.region,
      })
      .select()
      .single();

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    revalidatePath("/children");
    revalidatePath("/z-score");
    revalidatePath("/analytics");
    return { success: true, data: inserted };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Terjadi kesalahan sistem",
    };
  }
}
