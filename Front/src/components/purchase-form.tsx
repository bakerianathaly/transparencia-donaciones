"use client";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PURCHASE_CURRENCIES,
  purchaseSchema,
  type PurchaseInput,
} from "@/lib/purchases/schema";
import { registerPurchase, type PurchaseActionState } from "@/app/actions";

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

/** Lee un archivo y lo devuelve como data URL base64. */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const defaultValues: PurchaseInput = {
  storeName: "",
  currency: "USD",
  amount: undefined as unknown as number,
  image: "",
};

export function PurchaseForm() {
  const [isPending, startTransition] = useTransition();
  const [serverState, setServerState] = useState<PurchaseActionState>({
    status: "idle",
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PurchaseInput>({
    resolver: zodResolver(purchaseSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const result = await registerPurchase(data);
      setServerState(result);
      if (result.status === "success") {
        reset(defaultValues);
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
        <label htmlFor="storeName" className={labelClass}>
          Nombre del local {requiredMark}
        </label>
        <input
          id="storeName"
          type="text"
          placeholder="Nombre del comercio o local"
          className={fieldClass}
          {...register("storeName")}
        />
        {errors.storeName && (
          <p className={errorClass}>{errors.storeName.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="currency" className={labelClass}>
          Moneda {requiredMark}
        </label>
        <select id="currency" className={fieldClass} {...register("currency")}>
          {PURCHASE_CURRENCIES.map((value) => (
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
        <label htmlFor="amount" className={labelClass}>
          Cantidad {requiredMark}
        </label>
        <input
          id="amount"
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          placeholder="Cantidad de la compra"
          className={fieldClass}
          {...register("amount", {
            setValueAs: (value) =>
              value === "" || value === null ? undefined : Number(value),
          })}
        />
        {errors.amount && <p className={errorClass}>{errors.amount.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="image" className={labelClass}>
          Imagen del comprobante {requiredMark}
        </label>
        <Controller
          control={control}
          name="image"
          render={({ field: { onChange, onBlur, name, ref } }) => (
            <input
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              name={name}
              ref={ref}
              onBlur={onBlur}
              onChange={async (event) => {
                const file = event.target.files?.[0];
                onChange(file ? await fileToBase64(file) : "");
              }}
              className={`${fieldClass} py-2.5 text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-accent-soft file:px-3 file:py-2 file:text-sm file:font-semibold file:text-accent-strong`}
            />
          )}
        />
        {errors.image && (
          <p className={errorClass}>{errors.image.message as string}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 rounded-xl bg-accent px-4 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-accent-strong active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Registrando…" : "Registrar compra"}
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
