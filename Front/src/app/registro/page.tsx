import Link from "next/link";
import PageHeader from "@/components/page-header";
import { DonationForm } from "@/components/donation-form";

export default function RegistroPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-5 py-10 sm:py-14">
      <Link
        href="/"
        className="self-start text-sm font-semibold text-muted hover:text-accent-strong transition"
      >
        ← Volver
      </Link>

      <PageHeader title="Registro de donaciones">
        Cada aporte cuenta. Cargá tu donación y su comprobante; tu ayuda llega a
        quienes lo perdieron todo.
      </PageHeader>

      <div className="rise" style={{ animationDelay: "0.08s" }}>
        <DonationForm />
      </div>
    </main>
  );
}
