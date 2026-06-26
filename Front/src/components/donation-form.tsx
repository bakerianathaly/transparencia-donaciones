"use client";

import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CURRENCIES,
  donationSchema,
  RATE_REQUIRED_CURRENCY,
  type DonationInput,
} from "@/lib/donations/schema";
import { registerDonation, type DonationActionState } from "@/app/actions";

const fieldClass =
  "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-foreground/60 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20";
const labelClass = "block text-sm font-medium";
const errorClass = "text-xs text-red-600 dark:text-red-400";

export function DonationForm() {
  const [isPending, startTransition] = useTransition();
  const [serverState, setServerState] = useState<DonationActionState>({
    status: "idle",
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    resetField,
    reset,
    formState: { errors },
  } = useForm<DonationInput>({
    resolver: zodResolver(donationSchema),
    defaultValues: { name: "", currency: "USD" },
  });

  const currency = watch("currency");
  const rateEnabled = currency === RATE_REQUIRED_CURRENCY;

  // La tasa solo vive cuando la moneda es BS: al cambiar a otra, se limpia.
  useEffect(() => {
    if (!rateEnabled) {
      resetField("exchangeRate");
    }
  }, [rateEnabled, resetField]);

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("currency", data.currency);
    if (data.exchangeRate != null) {
      formData.set("exchangeRate", String(data.exchangeRate));
    }
    if (data.reference instanceof File) {
      formData.set("reference", data.reference);
    }

    startTransition(async () => {
      const result = await registerDonation(formData);
      setServerState(result);
      if (result.status === "success") {
        reset({ name: "", currency: "USD" });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className={labelClass}>
          Nombre
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Nombre del donante"
          className={fieldClass}
          {...register("name")}
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="currency" className={labelClass}>
          Moneda
        </label>
        <select id="currency" className={fieldClass} {...register("currency")}>
          {CURRENCIES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {errors.currency && (
          <p className={errorClass}>{errors.currency.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="exchangeRate" className={labelClass}>
          Tasa de cambio
          {!rateEnabled && (
            <span className="ml-1 font-normal text-foreground/50">
              (solo para BS)
            </span>
          )}
        </label>
        <input
          id="exchangeRate"
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          disabled={!rateEnabled}
          placeholder={rateEnabled ? "Bs por unidad" : "—"}
          className={fieldClass}
          {...register("exchangeRate", {
            setValueAs: (value) =>
              value === "" || value === null ? undefined : Number(value),
          })}
        />
        {errors.exchangeRate && (
          <p className={errorClass}>{errors.exchangeRate.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="reference" className={labelClass}>
          Imagen de referencia
        </label>
        <Controller
          control={control}
          name="reference"
          render={({ field: { onChange, onBlur, name, ref } }) => (
            <input
              id="reference"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              name={name}
              ref={ref}
              onBlur={onBlur}
              onChange={(event) => onChange(event.target.files?.[0])}
              className={`${fieldClass} file:mr-3 file:rounded file:border-0 file:bg-foreground file:px-3 file:py-1 file:text-background`}
            />
          )}
        />
        {errors.reference && (
          <p className={errorClass}>{errors.reference.message as string}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Registrando…" : "Registrar donación"}
      </button>

      {serverState.status === "success" && (
        <p className="text-sm text-green-700 dark:text-green-400">
          {serverState.message}
        </p>
      )}
      {serverState.status === "error" && (
        <p className={errorClass}>{serverState.message}</p>
      )}
    </form>
  );
}
