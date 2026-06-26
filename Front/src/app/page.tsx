import Image from "next/image";
import Link from "next/link";
import DonationCard from "@/components/donation-card";
import CopyField from "@/components/copy-field";
import PageHeader from "@/components/page-header";

const cardLinkClass =
  "inline-flex items-center justify-center rounded-xl bg-accent px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-accent-strong active:scale-[0.99]";

const bolivaresFields = [
  { label: "Banco", value: "Mercantil" },
  { label: "Número de cuenta", value: "0105 0017 6780 1706 2745" },
  { label: "Cédula", value: "V-27.163.928" },
  { label: "Teléfono", value: "0414-010-1007" },
  { label: "Titular", value: "Estefanía Monagas" },
];

const usdtFields = [
  { label: "Binance ID", value: "730137040" },
  { label: "Email", value: "bakerianathaly@gmail.com" },
  { label: "Usuario", value: "Nathaly Bakerian Scovino" },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-5 py-10 sm:py-14">
      <PageHeader title="Tu apoyo les brinda esperanza">
        Cada donación cuenta
      </PageHeader>

      <section
        className="rise flex flex-col gap-4"
        style={{ animationDelay: "0.06s" }}
      >
        <div className="rounded-2xl border-2 border-accent bg-accent-soft px-4 py-4 text-center">
          <p className="font-display text-lg font-semibold leading-snug text-accent-strong">
            A esta cuenta se deben enviar los montos de Bs, USD y Euros
          </p>
        </div>
        <Image
          src="/compress-principal.png"
          alt="Datos de cuenta bancaria para enviar las donaciones en Bs, USD y Euros"
          width={859}
          height={1156}
          sizes="(max-width: 448px) 92vw, 408px"
          quality={70}
          className="w-full h-auto rounded-2xl shadow-sm"
          priority
        />
      </section>

      <div className="flex flex-col gap-5">
        <div className="rise" style={{ animationDelay: "0.08s" }}>
          <DonationCard title="Bolívares" badge="Bs">
            {bolivaresFields.map((field) => (
              <CopyField key={field.label} label={field.label} value={field.value} />
            ))}
          </DonationCard>
        </div>

        <div className="rise" style={{ animationDelay: "0.16s" }}>
          <DonationCard title="Euros" badge="EUR">
            <p className="text-muted text-sm leading-relaxed">
              Enviá tu donación en euros de forma rápida y segura a través de Retorna.
            </p>
            <a
              href="https://www.retorna.app/es"
              target="_blank"
              rel="noopener noreferrer"
              className={cardLinkClass}
            >
              Enviar por Retorna →
            </a>
          </DonationCard>
        </div>

        <div className="rise" style={{ animationDelay: "0.24s" }}>
          <DonationCard title="Dólares" badge="USD">
            <p className="text-muted text-sm leading-relaxed">
              Enviá tu donación en dólares de forma rápida y segura a través de Remitly.
            </p>
            <a
              href="https://www.remitly.com/r/3ck13pb2"
              target="_blank"
              rel="noopener noreferrer"
              className={cardLinkClass}
            >
              Enviar por Remitly →
            </a>
          </DonationCard>
        </div>

        <div className="rise" style={{ animationDelay: "0.32s" }}>
          <DonationCard title="USDT / Binance" badge="USDT">
            <p className="text-muted text-sm leading-relaxed">
              Transferí vía Binance Pay con estos datos:
            </p>
            {usdtFields.map((field) => (
              <CopyField key={field.label} label={field.label} value={field.value} />
            ))}
          </DonationCard>
        </div>
      </div>

      <div className="rise flex flex-col gap-3" style={{ animationDelay: "0.40s" }}>
        <Link
          href="/registro"
          className="rounded-xl bg-accent px-4 py-4 text-center text-base font-semibold text-white shadow-sm transition hover:bg-accent-strong active:scale-[0.99]"
        >
          Registrar donación
        </Link>
        <Link
          href="/resumen"
          className="rounded-xl border border-border bg-surface px-4 py-3 text-center text-sm font-semibold text-muted shadow-sm transition hover:text-accent-strong hover:border-accent/40 active:scale-[0.99]"
        >
          Ver resumen
        </Link>
      </div>
    </main>
  );
}
