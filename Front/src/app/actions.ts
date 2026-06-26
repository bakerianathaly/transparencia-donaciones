"use server";

import { z } from "zod";
import { donationSchema } from "@/lib/donations/schema";
import { API_BASE_URL } from "@/lib/api";

const CURRENCY_LABELS: Record<string, string> = {
  USD: "Dolares",
  EUR: "Euros",
  USDT: "USDT",
  BS: "Bolivares",
};

export type DonationActionState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

/**
 * Registra una donación.
 *
 * Valida del lado del servidor y envía el payload JSON al backend
 * (FastAPI, carpeta Back/) en POST /api/v1/donaciones/.
 */
export async function registerDonation(
  formData: FormData,
): Promise<DonationActionState> {
  const rawRate = formData.get("exchangeRate");
  const rawAmount = formData.get("amount");

  const parsed = donationSchema.safeParse({
    name: formData.get("name"),
    amount:
      rawAmount === null || rawAmount === "" ? undefined : Number(rawAmount),
    currency: formData.get("currency"),
    exchangeRate:
      rawRate === null || rawRate === "" ? undefined : Number(rawRate),
    reference: formData.get("reference"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisá los campos del formulario.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  // Convertir la imagen de referencia a base64 puro (sin prefijo data:)
  const imagenBase64 = Buffer.from(
    await parsed.data.reference.arrayBuffer(),
  ).toString("base64");

  const payload = {
    nombre_completo: parsed.data.name,
    moneda: CURRENCY_LABELS[parsed.data.currency],
    cantidad: parsed.data.amount,
    tasa_cambio: parsed.data.exchangeRate ?? null,
    imagen_base64: imagenBase64,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/donaciones/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return {
        status: "error",
        message: "No se pudo registrar la donación. Intentá de nuevo.",
      };
    }

    return {
      status: "success",
      message: "¡Tu donación fue registrada exitosamente!",
    };
  } catch {
    return {
      status: "error",
      message: "No se pudo conectar con el servidor. Intentá de nuevo.",
    };
  }
}
