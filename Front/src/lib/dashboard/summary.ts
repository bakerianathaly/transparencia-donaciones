import { API_BASE_URL } from "@/lib/api";

export type DonationsSummary = {
  total_donaciones: number;
  total_usd: string;
  total_bolivares: string;
  total_usdt: string;
  total_eur: string;
};

type SummaryResponse = {
  success: boolean;
  message: string;
  outcome: DonationsSummary[];
  errors: string[];
};

export type SummaryResult =
  | { status: "ok"; data: DonationsSummary }
  | { status: "empty" }
  | { status: "error"; error: string };

export async function getDonationsSummary(): Promise<SummaryResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/resumen`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return { status: "error", error: "No se pudo cargar el resumen." };
    }

    const json: SummaryResponse = await res.json();
    const data = json.outcome?.[0];

    // Sin filas o con cero donaciones: no es un error, simplemente no hay nada aún.
    if (!data || data.total_donaciones === 0) {
      return { status: "empty" };
    }

    return { status: "ok", data };
  } catch {
    return { status: "error", error: "No se pudo conectar con el servidor." };
  }
}
