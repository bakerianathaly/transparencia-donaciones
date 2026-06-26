import { API_BASE_URL } from "@/lib/api";

export type Purchase = {
  id: string;
  nombre_local: string;
  moneda: string;
  cantidad: string;
  imagen_url: string;
  created_at: string;
};

type PurchasesResponse = {
  success: boolean;
  message: string;
  outcome: Purchase[];
  errors: string[];
};

export type PurchasesResult =
  | { status: "ok"; data: Purchase[] }
  | { status: "empty" }
  | { status: "error"; error: string };

export async function getPurchases(): Promise<PurchasesResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/compras/?skip=0&limit=100`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return { status: "error", error: "No se pudo cargar el resumen de compras." };
    }

    const json: PurchasesResponse = await res.json();
    const outcome = json.outcome ?? [];

    if (outcome.length === 0) {
      return { status: "empty" };
    }

    return { status: "ok", data: outcome };
  } catch {
    return { status: "error", error: "No se pudo conectar con el servidor." };
  }
}
