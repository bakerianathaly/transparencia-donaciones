"use client";

import { useState, useEffect, useRef } from "react";

interface CopyFieldProps {
  label: string;
  value: string;
}

export default function CopyField({ label, value }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted leading-none mb-1">{label}</p>
        <p className="font-medium text-foreground break-words">{value}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copiar ${label}: ${value}`}
        className="shrink-0 rounded-lg bg-accent-soft px-3 py-1.5 text-sm font-semibold text-accent-strong transition hover:bg-accent-soft/70 active:scale-95"
      >
        {copied ? "¡Copiado!" : "Copiar"}
      </button>
    </div>
  );
}
