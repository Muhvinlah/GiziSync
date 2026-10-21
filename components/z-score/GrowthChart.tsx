"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import whoLms from "@/lib/who-lms.json";
import { Gender } from "@/lib/zscore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot, CartesianGrid, Legend } from "recharts";

interface GrowthChartProps {
  gender: Gender;
  ageMonths: number;
  heightCm: number;
  weightKg: number;
  childName?: string;
}

type IndicatorType = "hfa" | "wfa" | "wfh";

function GrowthChartInner({
  gender,
  ageMonths,
  heightCm,
  weightKg,
  childName = "Balita",
}: GrowthChartProps) {
  const [indicator, setIndicator] = useState<IndicatorType>("hfa");

  // Siapkan data kurva berdasarkan indikator yang dipilih
  const chartData = useMemo(() => {
    const lmsDb = whoLms as any;
    const points: any[] = [];

    if (indicator === "hfa") {
      const hfaData = lmsDb.hfa?.[gender] || {};
      for (let m = 0; m <= 60; m += 2) {
        const entry = hfaData[String(m)];
        if (entry) {
          points.push({
            x: m,
            sd3neg: entry.sd3neg,
            sd2neg: entry.sd2neg,
            sd0: entry.sd0,
            sd2: entry.sd2,
            sd3: entry.sd3,
          });
        }
      }
    } else if (indicator === "wfa") {
      const wfaData = lmsDb.wfa?.[gender] || {};
      for (let m = 0; m <= 60; m += 2) {
        const entry = wfaData[String(m)];
        if (entry) {
          points.push({
            x: m,
            sd3neg: entry.sd3neg,
            sd2neg: entry.sd2neg,
            sd0: entry.sd0,
            sd2: entry.sd2,
            sd3: entry.sd3,
          });
        }
      }
    } else {
      const wfhData = lmsDb.wfh?.[gender] || {};
      for (let h = 45; h <= 120; h += 2) {
        const key = `${h}.0`;
        const entry = wfhData[key];
        if (entry) {
          points.push({
            x: h,
            sd3neg: entry.sd3neg,
            sd2neg: entry.sd2neg,
            sd0: entry.sd0,
            sd2: entry.sd2,
            sd3: entry.sd3,
          });
        }
      }
    }

    return points;
  }, [gender, indicator]);

  // Tentukan titik anak saat ini
  const childPoint = useMemo(() => {
    if (indicator === "hfa") {
      return { x: Math.min(Math.max(0, ageMonths), 60), y: heightCm };
    }
    if (indicator === "wfa") {
      return { x: Math.min(Math.max(0, ageMonths), 60), y: weightKg };
    }
    return { x: Math.min(Math.max(45, heightCm), 120), y: weightKg };
  }, [indicator, ageMonths, heightCm, weightKg]);

  const xLabel = indicator === "wfh" ? "Tinggi/Panjang Badan (cm)" : "Usia (Bulan)";
  const yLabel = indicator === "hfa" ? "Tinggi Badan (cm)" : "Berat Badan (kg)";

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            Kurva Pertumbuhan Standar WHO
            <span className="text-xs font-normal px-2 py-0.5 rounded bg-muted">
              {gender === "male" ? "Laki-laki" : "Perempuan"}
            </span>
          </CardTitle>
          <CardDescription className="text-xs">
            Posisi titik {childName} terhadap garis standar deviasi (SD) WHO
          </CardDescription>
        </div>

        {/* Tab switcher indikator */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-md text-xs">
          <Button
            size="sm"
            variant={indicator === "hfa" ? "default" : "ghost"}
            className="h-7 text-xs px-2.5"
            onClick={() => setIndicator("hfa")}
          >
            TB/U (Stunting)
          </Button>
          <Button
            size="sm"
            variant={indicator === "wfa" ? "default" : "ghost"}
            className="h-7 text-xs px-2.5"
            onClick={() => setIndicator("wfa")}
          >
            BB/U (Underweight)
          </Button>
          <Button
            size="sm"
            variant={indicator === "wfh" ? "default" : "ghost"}
            className="h-7 text-xs px-2.5"
            onClick={() => setIndicator("wfh")}
          >
            BB/TB (Wasting)
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-[320px] w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="x"
                label={{ value: xLabel, position: "insideBottom", offset: -10, fontSize: 11 }}
              />
              <YAxis
                label={{ value: yLabel, angle: -90, position: "insideLeft", offset: 10, fontSize: 11 }}
                domain={["auto", "auto"]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover border p-2.5 rounded-md shadow-md text-xs space-y-1">
                        <div className="font-semibold text-foreground">
                          {xLabel}: {data.x}
                        </div>
                        <div className="text-purple-600">+3 SD: {data.sd3}</div>
                        <div className="text-amber-500">+2 SD: {data.sd2}</div>
                        <div className="text-emerald-600 font-medium">Median (0 SD): {data.sd0}</div>
                        <div className="text-amber-500">-2 SD: {data.sd2neg}</div>
                        <div className="text-red-600 font-medium">-3 SD: {data.sd3neg}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={32} iconSize={8} />

              {/* Kurva Standar Deviasi WHO */}
              <Line type="monotone" dataKey="sd3" stroke="#9333ea" strokeWidth={1} dot={false} name="+3 SD" />
              <Line type="monotone" dataKey="sd2" stroke="#f59e0b" strokeWidth={1} dot={false} name="+2 SD" />
              <Line type="monotone" dataKey="sd0" stroke="#10b981" strokeWidth={2} dot={false} name="Median (0)" />
              <Line type="monotone" dataKey="sd2neg" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="-2 SD (Batas Defisit)" strokeDasharray="4 2" />
              <Line type="monotone" dataKey="sd3neg" stroke="#ef4444" strokeWidth={2} dot={false} name="-3 SD (Kritis)" strokeDasharray="3 3" />

              {/* Titik Pengukuran Balita */}
              <ReferenceDot
                x={childPoint.x}
                y={childPoint.y}
                r={7}
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth={2}
                label={{
                  value: `${childName} (${childPoint.y})`,
                  position: "top",
                  fill: "#2563eb",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Export dynamic component dengan ssr: false sesuai aturan PRD & CLAUDE.md
export const GrowthChart = dynamic(() => Promise.resolve(GrowthChartInner), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] w-full rounded-lg border bg-muted/30 flex items-center justify-center text-xs text-muted-foreground animate-pulse">
      Memuat Kurva Pertumbuhan WHO...
    </div>
  ),
});
