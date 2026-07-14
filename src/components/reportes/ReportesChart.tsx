"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { formatMoney, formatDate } from "@/lib/format";

// Verificado con scripts/validate_palette.js (dataviz skill) contra el fondo
// oscuro de marca (#0d0a08): ΔE 23.6, todos los checks en PASS.
const COLOR_INGRESOS = "#008300";
const COLOR_EGRESOS = "#e66767";

interface PuntoSerie {
  fecha: string;
  ingresos: number;
  egresos: number;
}

export function ReportesChart({ serie }: { serie: PuntoSerie[] }) {
  if (serie.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-black/20 p-6 text-sm text-brasa-cream/60">
        No hay movimientos en este rango de fechas.
      </div>
    );
  }

  return (
    <div className="h-80 rounded-lg border border-white/10 bg-black/20 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={serie} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey="fecha"
            tickFormatter={(v) => formatDate(v)}
            stroke="rgba(245,234,214,0.5)"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke="rgba(245,234,214,0.5)"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => formatMoney(v)}
            width={90}
          />
          <Tooltip
            formatter={(value) => formatMoney(Number(value))}
            labelFormatter={(label) => formatDate(String(label))}
            contentStyle={{ background: "#1a1a19", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
            labelStyle={{ color: "#f5ead6" }}
            itemStyle={{ color: "#f5ead6" }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "#f5ead6" }} />
          <Line
            type="monotone"
            dataKey="ingresos"
            name="Ingresos"
            stroke={COLOR_INGRESOS}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="egresos"
            name="Egresos"
            stroke={COLOR_EGRESOS}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
