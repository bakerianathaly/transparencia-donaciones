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

// text-base (16px) evita el zoom automático de iOS al enfocar un campo.
const fieldClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-foreground outline-none transition placeholder:text-muted/60 focus:border-accent focus:ring-4 focus:ring-accent/10 disabled:cursor-not-allowed disabled:bg-black/[0.03] disabled:opacity-60";
const labelClass = "block text-sm font-semibold text-foreground";
const errorClass = "text-sm font-medium text-danger";
const requiredMark = (
  <span className="text-danger" aria-hidden="true">
    *
  </span>
);

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
    formData.set("amount", String(data.amount));
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
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 shadow-sm"
    >
      <p className="text-sm text-muted">
        Los campos marcados con{" "}
        <span className="font-semibold text-danger">*</span> son obligatorios.
      </p>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className={labelClass}>
          Nombre completo {requiredMark}
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Nombre completo del donante"
          className={fieldClass}
          {...register("name")}
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="amount" className={labelClass}>
          Monto {requiredMark}
        </label>
        <input
          id="amount"
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          placeholder="Monto del aporte"
          className={fieldClass}
          {...register("amount", {
            setValueAs: (value) =>
              value === "" || value === null ? undefined : Number(value),
          })}
        />
        {errors.amount && <p className={errorClass}>{errors.amount.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="currency" className={labelClass}>
          Moneda {requiredMark}
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
            <span className="ml-1 font-normal text-muted">(solo para BS)</span>
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
          Imagen de referencia {requiredMark}
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
              className={`${fieldClass} py-2.5 text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-accent-soft file:px-3 file:py-2 file:text-sm file:font-semibold file:text-accent-strong`}
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
        className="mt-1 rounded-xl bg-accent px-4 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-accent-strong active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Registrando…" : "Registrar aporte"}
      </button>

      {serverState.status === "success" && (
        <p className="rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
          {serverState.message}
        </p>
      )}
      {serverState.status === "error" && (
        <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {serverState.message}
        </p>
      )}
    </form>
  );
}
