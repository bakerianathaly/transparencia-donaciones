import Image from "next/image";
import type { Purchase } from "@/lib/dashboard/purchases";

// Mapa de monedas hoistado fuera del componente (server-hoist-static-io)
const CURRENCY_LABELS: Record<string, string> = {
  USDT: "USDT",
  BOLIVARES: "Bs",
};

const fmt = (v: string) =>
  new Intl.NumberFormat("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(v) || 0);

const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

interface PurchasesListProps {
  data: Purchase[];
}

export default function PurchasesList({ data }: PurchasesListProps) {
  return (
    <div className="flex flex-col gap-4">
      {data.map((p) => {
        const currencyLabel = CURRENCY_LABELS[p.moneda] ?? p.moneda;
        return (
          <div
            key={p.id}
            className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
          >
            {/* Imagen grande a todo el ancho */}
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={p.imagen_url}
                alt={`Comprobante de compra en ${p.nombre_local}`}
                fill
                className="object-cover"
                sizes="(max-width: 448px) 100vw, 448px"
              />
            </div>

            {/* Datos */}
            <div className="flex flex-col gap-1.5 p-4">
              <span className="font-display text-base font-semibold text-foreground">
                {capitalize(p.nombre_local)}
              </span>

              <div className="flex items-center gap-2">
                <span className="bg-accent-soft text-accent-strong rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider">
                  {currencyLabel}
                </span>
                <span className="font-display text-lg font-semibold text-foreground">
                  {fmt(p.cantidad)}
                </span>
              </div>

              <span className="text-xs text-muted">{p.created_at}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
