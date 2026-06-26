import { z } from "zod";

/** Monedas aceptadas para registrar una donación. */
export const CURRENCIES = ["USD", "USDT", "BS"] as const;
export type Currency = (typeof CURRENCIES)[number];

/** La tasa de cambio solo aplica cuando la moneda es bolívares. */
export const RATE_REQUIRED_CURRENCY: Currency = "BS";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/** Imagen de referencia del comprobante de la donación. */
const referenceImageSchema = z
  .instanceof(File, { error: "La imagen de referencia es obligatoria" })
  .refine((file) => file.size > 0, {
    error: "La imagen de referencia es obligatoria",
  })
  .refine((file) => file.size <= MAX_IMAGE_BYTES, {
    error: "La imagen no puede superar los 5 MB",
  })
  .refine(
    (file) => (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type),
    { error: "Formato inválido. Usá JPG, PNG o WEBP" },
  );

/**
 * Schema de una donación.
 *
 * Regla de negocio: `exchangeRate` es obligatoria SOLO cuando la moneda es BS.
 * Para USD y USDT debe quedar sin valor.
 */
export const donationSchema = z
  .object({
    name: z.string().trim().min(1, { error: "El nombre es obligatorio" }),
    currency: z.enum(CURRENCIES, { error: "Seleccioná una moneda" }),
    exchangeRate: z
      .number({ error: "La tasa de cambio debe ser un número" })
      .positive({ error: "La tasa de cambio debe ser mayor a 0" })
      .optional(),
    reference: referenceImageSchema,
  })
  .superRefine((data, ctx) => {
    if (data.currency === RATE_REQUIRED_CURRENCY && data.exchangeRate == null) {
      ctx.addIssue({
        code: "custom",
        message: "La tasa de cambio es obligatoria cuando la moneda es BS",
        path: ["exchangeRate"],
      });
    }
  });

export type DonationInput = z.input<typeof donationSchema>;
export type Donation = z.output<typeof donationSchema>;
