import Link from "next/link";

// Estado vacío amable: todavía no hay donaciones, invitamos a ser el primero.
export default function SummaryEmpty() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
      <span
        className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-3xl"
        aria-hidden="true"
      >
        💛
      </span>
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Todavía no hay donaciones
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          Sé la primera persona en aportar. Cada donación cuenta y aparecerá acá
          apenas la registres.
        </p>
      </div>
      <Link
        href="/registro"
        className="mt-1 rounded-xl bg-accent px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-accent-strong active:scale-[0.99]"
      >
        Registrar la primera donación
      </Link>
    </div>
  );
}
