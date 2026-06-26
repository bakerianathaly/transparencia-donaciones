"use server";

import { z } from "zod";
import { donationSchema } from "@/lib/donations/schema";

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
 * Por ahora solo valida del lado del servidor y confirma. El envío real al
 * backend (FastAPI, carpeta Back/) se cablea cuando el endpoint esté listo.
 */
export async function registerDonation(
  formData: FormData,
): Promise<DonationActionState> {
  const rawRate = formData.get("exchangeRate");

  const parsed = donationSchema.safeParse({
    name: formData.get("name"),
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

  // TODO(Back): POST multipart hacia la API de FastAPI cuando exista el endpoint.
  return {
    status: "success",
    message: `Donación de ${parsed.data.name} registrada (pendiente de envío al backend).`,
  };
}
