  "use server";

import { z } from "zod";
import { donationSchema } from "@/lib/donations/schema";
import { purchaseSchema } from "@/lib/purchases/schema";
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

export type PurchaseActionState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

/**
 * Registra una compra.
 *
 * Recibe la imagen del comprobante como data URL base64, valida del lado del
 * servidor y envía el payload JSON al backend (FastAPI, carpeta Back/) en
 * POST /api/v1/compras/.
 */
export async function registerPurchase(
  input: unknown,
): Promise<PurchaseActionState> {
  const parsed = purchaseSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisá los campos del formulario.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  // El schema guarda el data URL completo; el backend espera base64 puro
  // (sin el prefijo "data:image/...;base64,"), igual que en donaciones.
  const imagenBase64 = parsed.data.image.slice(
    parsed.data.image.indexOf(",") + 1,
  );

  const payload = {
    nombre_local: parsed.data.storeName,
    moneda: CURRENCY_LABELS[parsed.data.currency],
    cantidad: parsed.data.amount,
    imagen_base64: imagenBase64,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/compras/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return {
        status: "error",
        message: "No se pudo registrar la compra. Intentá de nuevo.",
      };
    }

    return {
      status: "success",
      message: "¡La compra fue registrada exitosamente!",
    };
  } catch {
    return {
      status: "error",
      message: "No se pudo conectar con el servidor. Intentá de nuevo.",
    };
  }
}
