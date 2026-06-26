import { DonationForm } from "@/components/donation-form";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-6 py-12">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Registro de donaciones</h1>
        <p className="text-sm text-foreground/60">
          Cargá los datos del aporte y su comprobante de referencia.
        </p>
      </header>
      <DonationForm />
    </main>
  );
}
