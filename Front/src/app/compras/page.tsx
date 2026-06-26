import Link from "next/link";
import PageHeader from "@/components/page-header";
import { PurchaseForm } from "@/components/purchase-form";

export default function ComprasPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-5 py-10 sm:py-14">
      <Link
        href="/"
        className="self-start text-sm font-semibold text-muted hover:text-accent-strong transition"
      >
        ← Volver
      </Link>

      <PageHeader title="Registro de compras">
        Registrá cada compra del centro de acopio y subí su comprobante para
        mantener la trazabilidad de cada gasto.
      </PageHeader>

      <div className="rise" style={{ animationDelay: "0.08s" }}>
        <PurchaseForm />
      </div>
    </main>
  );
}
