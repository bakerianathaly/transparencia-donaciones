import { API_BASE_URL } from "@/lib/api";

export type Donation = {
  id: string;
  nombre: string;
  moneda: string;
  cantidad: string;
  tasa_cambio: string | null;
  cantidad_bolivares: string | null;
  imagen_url: string;
  created_at: string;
  updated_at: string;
};

type DonationsResponse = {
  success: boolean;
  message: string;
  outcome: Donation[];
  errors: string[];
};

export type DonationsResult =
  | { status: "ok"; data: Donation[] }
  | { status: "empty" }
  | { status: "error"; error: string };

export async function getDonations(): Promise<DonationsResult> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/donaciones/?skip=0&limit=100`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      return {
        status: "error",
        error: "No se pudo cargar el listado de donaciones.",
      };
    }

    const json: DonationsResponse = await res.json();
    const outcome = json.outcome ?? [];

    if (outcome.length === 0) {
      return { status: "empty" };
    }

    return { status: "ok", data: outcome };
  } catch {
    return { status: "error", error: "No se pudo conectar con el servidor." };
  }
}
