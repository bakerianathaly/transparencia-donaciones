import Link from "next/link";
import PageHeader from "@/components/page-header";
import SummaryCards from "@/components/summary-cards";
import SummaryEmpty from "@/components/summary-empty";
import PurchasesList from "@/components/purchases-list";
import PurchasesEmpty from "@/components/purchases-empty";
import { getDonationsSummary } from "@/lib/dashboard/summary";
import { getPurchases } from "@/lib/dashboard/purchases";

export default async function ResumenPage() {
  // Fetch en paralelo: no encadenamos awaits (async-parallel)
  const [result, purchasesResult] = await Promise.all([
    getDonationsSummary(),
    getPurchases(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-5 py-10 sm:py-14">
      <Link
        href="/"
        className="self-start text-sm font-semibold text-muted hover:text-accent-strong transition"
      >
        ← Volver
      </Link>

      <PageHeader title="Resumen de donaciones">
        Esto es lo que llevamos recaudado gracias a tu apoyo.
      </PageHeader>

      <div className="rise" style={{ animationDelay: "0.08s" }}>
        {result.status === "ok" ? (
          <SummaryCards data={result.data} />
        ) : result.status === "empty" ? (
          <SummaryEmpty />
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-5 text-center shadow-sm">
            <p className="text-muted">{result.error}</p>
          </div>
        )}
      </div>

      <PageHeader title="Resumen de compras">
        Así estamos usando lo recaudado.
      </PageHeader>

      <div className="rise" style={{ animationDelay: "0.16s" }}>
        {purchasesResult.status === "ok" ? (
          <PurchasesList data={purchasesResult.data} />
        ) : purchasesResult.status === "empty" ? (
          <PurchasesEmpty />
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-5 text-center shadow-sm">
            <p className="text-muted">{purchasesResult.error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
