// Estado vacío: todavía no hay donaciones registradas.
export default function DonationsEmpty() {
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
          Todavía no hay donaciones registradas
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          Acá aparecerá cada donación recibida con su comprobante, para que todo
          sea transparente.
        </p>
      </div>
    </div>
  );
}
