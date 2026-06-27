"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface DonationImageProps {
  src: string;
  alt: string;
}

// next/image revienta con src vacío o relativo: sólo aceptamos URLs absolutas.
const isValidSrc = (value: string) => /^https?:\/\//.test(value);

export default function DonationImage({ src, alt }: DonationImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasImage = isValidSrc(src);

  // Bloquea el scroll del body mientras el lightbox está abierto
  useEffect(() => {
    if (!isOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  // Sin comprobante válido: placeholder, sin lightbox.
  if (!hasImage) {
    return (
      <div className="flex aspect-4/3 w-full items-center justify-center bg-surface text-sm text-muted">
        Sin comprobante
      </div>
    );
  }

  const lightbox = (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
    >
      {/* Botón de cierre, respetando el notch/safe-area en mobile */}
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        aria-label="Cerrar"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
        className="absolute right-4 z-[1] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white backdrop-blur-sm active:scale-95"
      >
        ✕
      </button>

      {/* Imagen ampliada: object-contain para no recortar el comprobante */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-full max-h-[88vh] w-full max-w-3xl"
      >
        <Image src={src} alt={alt} fill className="object-contain" sizes="100vw" />
      </div>
    </div>
  );

  return (
    <>
      {/* Miniatura: al tocarla abre el comprobante en grande */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Ampliar comprobante"
        className="relative block aspect-4/3 w-full cursor-zoom-in"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 448px) 100vw, 448px"
        />
      </button>

      {/* isOpen sólo es true tras un click → siempre en cliente, document existe */}
      {isOpen && createPortal(lightbox, document.body)}
    </>
  );
}
