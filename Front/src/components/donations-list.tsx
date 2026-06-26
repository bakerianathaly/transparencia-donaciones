import Image from "next/image";
import type { Donation } from "@/lib/dashboard/donations";

// El backend devuelve la moneda en MAYÚSCULAS y plural (ej: "EUROS").
const CURRENCY_LABELS: Record<string, string> = {
  DOLARES: "USD",
  EUROS: "EUR",
  BOLIVARES: "Bs",
  USDT: "USDT",
};

const fmt = (v: string) =>
  new Intl.NumberFormat("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(v) || 0);

const fmtDate = (v: string) =>
  new Intl.DateTimeFormat("es-VE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(v));

const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

interface DonationsListProps {
  data: Donation[];
}

export default function DonationsList({ data }: DonationsListProps) {
  return (
    <div className="flex flex-col gap-4">
      {data.map((d) => {
        const currencyLabel = CURRENCY_LABELS[d.moneda] ?? capitalize(d.moneda);
        return (
          <div
            key={d.id}
            className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
          >
            {/* Imagen grande a todo el ancho */}
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={d.imagen_url}
                alt={`Comprobante de donación de ${d.nombre}`}
                fill
                className="object-cover"
                sizes="(max-width: 448px) 100vw, 448px"
              />
            </div>

            {/* Datos */}
            <div className="flex flex-col gap-1.5 p-4">
              {/* El nombre del donante se respeta tal cual lo guarda el backend */}
              <span className="font-display text-base font-semibold text-foreground">
                {d.nombre}
              </span>

              <div className="flex items-center gap-2">
                <span className="bg-accent-soft text-accent-strong rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider">
                  {currencyLabel}
                </span>
                <span className="font-display text-lg font-semibold text-foreground">
                  {fmt(d.cantidad)}
                </span>
              </div>

              {/* Conversión a bolívares solo cuando el backend la calculó */}
              {d.cantidad_bolivares != null && (
                <span className="text-sm text-muted">
                  ≈ Bs {fmt(d.cantidad_bolivares)}
                </span>
              )}

              <span className="text-xs text-muted">{fmtDate(d.created_at)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
