import type { DonationsSummary } from "@/lib/dashboard/summary";

// Configuración estática hoistada fuera del componente (rendering-hoist-jsx)
const CURRENCY_CONFIG = [
  {
    key: "total_usd" as const,
    label: "Dólares",
    badge: "USD",
    prefix: "$",
    suffix: "",
  },
  {
    key: "total_eur" as const,
    label: "Euros",
    badge: "EUR",
    prefix: "€",
    suffix: "",
  },
  {
    key: "total_usdt" as const,
    label: "USDT",
    badge: "USDT",
    prefix: "",
    suffix: "",
  },
  {
    key: "total_bolivares" as const,
    label: "Bolívares",
    badge: "Bs",
    prefix: "Bs ",
    suffix: "",
  },
];

const fmt = (v: string) =>
  new Intl.NumberFormat("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(v) || 0);

interface SummaryCardsProps {
  data: DonationsSummary;
}

export default function SummaryCards({ data }: SummaryCardsProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Hero stat */}
      <div className="rounded-2xl border border-accent/30 bg-accent-soft p-6 text-center flex flex-col items-center gap-2">
        <span className="font-display text-5xl font-semibold text-accent-strong">
          {data.total_donaciones}
        </span>
        <span className="text-sm text-muted">donaciones registradas</span>
      </div>

      {/* Grid 2×2 de totales por moneda */}
      <div className="grid grid-cols-2 gap-3">
        {CURRENCY_CONFIG.map((c) => (
          <div
            key={c.key}
            className="rounded-2xl border border-border bg-surface p-4 shadow-sm flex flex-col gap-2"
          >
            <span className="bg-accent-soft text-accent-strong rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider self-start">
              {c.badge}
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted">{c.label}</span>
              <span className="font-display text-xl font-semibold text-foreground">
                {c.prefix}
                {fmt(data[c.key] as string)}
                {c.suffix}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
