"use client";

import { useEffect, useState } from "react";
import { ReportesChart } from "@/components/reportes/ReportesChart";
import { formatMoney, formatDate } from "@/lib/format";
import type { ReporteResumen } from "@/lib/types";

function isoHaceDias(dias: number) {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d.toISOString().slice(0, 10);
}

const PRESETS = [
  { label: "Últimos 7 días", dias: 7 },
  { label: "Últimos 30 días", dias: 30 },
  { label: "Últimos 90 días", dias: 90 },
];

export function ReportesClient() {
  const [desde, setDesde] = useState(isoHaceDias(30));
  const [hasta, setHasta] = useState(isoHaceDias(0));
  const [resumen, setResumen] = useState<ReporteResumen | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    // Patrón de fetch-en-efecto documentado por React (reset de loading/error
    // al cambiar de rango); eslint-plugin-react-hooks lo marca igual.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCargando(true);
    setError(null);

    fetch(`/api/gas/reportes?desde=${desde}&hasta=${hasta}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelado) return;
        if (!json.ok) {
          setError(json.error || "No se pudo cargar el reporte.");
          return;
        }
        setResumen(json.data);
      })
      .catch(() => {
        if (!cancelado) setError("No se pudo cargar el reporte.");
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [desde, hasta]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-3">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setDesde(isoHaceDias(p.dias));
              setHasta(isoHaceDias(0));
            }}
            className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-brasa-cream/80 transition hover:bg-white/5"
          >
            {p.label}
          </button>
        ))}
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-brasa-cream/80">Desde</span>
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-brasa-cream outline-none focus:border-brasa-flame"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-brasa-cream/80">Hasta</span>
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-brasa-cream outline-none focus:border-brasa-flame"
          />
        </label>
      </div>

      {error && (
        <p className="rounded-md border border-brasa-ember/60 bg-brasa-ember/10 px-3 py-2 text-sm">{error}</p>
      )}

      {cargando && !resumen ? (
        <p className="text-sm text-brasa-cream/60">Cargando…</p>
      ) : resumen ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatTile label="Ingresos" value={resumen.ingresos} color="#008300" />
            <StatTile label="Egresos" value={resumen.egresos} color="#e66767" />
            <StatTile label="Neto" value={resumen.neto} color={resumen.neto >= 0 ? "#008300" : "#e66767"} />
          </div>

          <ReportesChart serie={resumen.serie} />

          <details className="text-sm">
            <summary className="cursor-pointer text-brasa-cream/70">Ver tabla de datos</summary>
            <div className="mt-2 overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full min-w-max text-left text-sm">
                <thead className="bg-white/5 text-brasa-cream/70">
                  <tr>
                    <th className="px-4 py-2 font-medium">Fecha</th>
                    <th className="px-4 py-2 font-medium">Ingresos</th>
                    <th className="px-4 py-2 font-medium">Egresos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {resumen.serie.map((d) => (
                    <tr key={d.fecha}>
                      <td className="px-4 py-2">{formatDate(d.fecha)}</td>
                      <td className="px-4 py-2">{formatMoney(d.ingresos)}</td>
                      <td className="px-4 py-2">{formatMoney(d.egresos)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      ) : null}
    </div>
  );
}

function StatTile({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-4">
      <p className="text-xs text-brasa-cream/60">{label}</p>
      <p className="mt-1 text-2xl font-semibold" style={{ color }}>
        {formatMoney(value)}
      </p>
    </div>
  );
}
