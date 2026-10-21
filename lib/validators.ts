import { z } from "zod";

export const genderSchema = z.enum(["male", "female"]);

export const measurementSchema = z.object({
  child_id: z.string().min(1, "Anak wajib dipilih"),
  measured_at: z
    .string()
    .min(1, "Tanggal pengukuran wajib diisi")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
  age_months: z
    .number()
    .int("Usia bulan harus bilangan bulat")
    .min(0, "Usia minimal 0 bulan")
    .max(60, "Usia maksimal 60 bulan (5 tahun)"),
  height_cm: z
    .number()
    .min(45, "Tinggi badan minimal 45 cm")
    .max(120, "Tinggi badan maksimal 120 cm"),
  weight_kg: z
    .number()
    .min(1.5, "Berat badan minimal 1.5 kg")
    .max(35, "Berat badan maksimal 35 kg"),
  gender: genderSchema,
});

export type MeasurementFormData = z.infer<typeof measurementSchema>;

export const childSchema = z.object({
  name: z.string().min(2, "Nama anak minimal 2 karakter"),
  birth_date: z
    .string()
    .min(1, "Tanggal lahir wajib diisi")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
  gender: genderSchema,
  region: z.string().min(2, "Wilayah/Desa minimal 2 karakter"),
});

export type ChildFormData = z.infer<typeof childSchema>;

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export interface OfflineQueueItem extends MeasurementFormData {
  local_id: string;
  queued_at: string;
  child_name?: string;
  preview_zscores?: {
    zscore_hfa: number;
    zscore_wfa: number;
    zscore_wfh: number;
    status_hfa: string;
    status_wfa: string;
    status_wfh: string;
    needs_intervention: boolean;
  };
}
