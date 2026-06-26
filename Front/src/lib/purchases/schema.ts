import { z } from "zod";

/** Monedas aceptadas para registrar una compra. */
export const PURCHASE_CURRENCIES = ["USD", "EUR", "USDT", "BS"] as const;
export type PurchaseCurrency = (typeof PURCHASE_CURRENCIES)[number];

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
/** La imagen viaja como data URL base64 de un formato soportado. */
const ACCEPTED_IMAGE_DATA_URL = /^data:image\/(jpeg|png|webp);base64,/;

/** Tamaño en bytes del contenido decodificado de un data URL base64. */
function base64ByteSize(dataUrl: string): number {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  if (base64.length === 0) return 0;
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

/** Imagen del comprobante de la compra, como data URL base64. */
const imageBase64Schema = z
  .string({ error: "La imagen es obligatoria" })
  .min(1, { error: "La imagen es obligatoria" })
  .refine((value) => ACCEPTED_IMAGE_DATA_URL.test(value), {
    error: "Formato inválido. Usá JPG, PNG o WEBP",
  })
  .refine((value) => base64ByteSize(value) <= MAX_IMAGE_BYTES, {
    error: "La imagen no puede superar los 5 MB",
  });

/** Schema de una compra registrada en un local. */
export const purchaseSchema = z.object({
  storeName: z
    .string()
    .trim()
    .min(1, { error: "El nombre del local es obligatorio" }),
  currency: z.enum(PURCHASE_CURRENCIES, { error: "Seleccioná una moneda" }),
  amount: z
    .number({ error: "Ingresá una cantidad válida" })
    .positive({ error: "La cantidad debe ser mayor a 0" }),
  image: imageBase64Schema,
});

export type PurchaseInput = z.input<typeof purchaseSchema>;
export type Purchase = z.output<typeof purchaseSchema>;
