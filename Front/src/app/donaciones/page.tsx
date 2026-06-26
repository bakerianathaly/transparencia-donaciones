import Link from "next/link";
import PageHeader from "@/components/page-header";
import DonationsList from "@/components/donations-list";
import DonationsEmpty from "@/components/donations-empty";
import { getDonations } from "@/lib/dashboard/donations";

export default async function DonacionesPage() {
  const result = await getDonations();

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-5 py-10 sm:py-14">
      <Link
        href="/"
        className="self-start text-sm font-semibold text-muted hover:text-accent-strong transition"
      >
        ← Volver
      </Link>

      <PageHeader title="Listado de donaciones">
        Cada donación recibida, con su comprobante. Transparencia total.
      </PageHeader>

      <div className="rise" style={{ animationDelay: "0.08s" }}>
        {result.status === "ok" ? (
          <DonationsList data={result.data} />
        ) : result.status === "empty" ? (
          <DonationsEmpty />
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-5 text-center shadow-sm">
            <p className="text-muted">{result.error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
