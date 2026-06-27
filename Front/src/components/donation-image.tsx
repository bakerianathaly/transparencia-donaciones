"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface DonationImageProps {
  src: string;
  alt: string;
}

export default function DonationImage({ src, alt }: DonationImageProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
      {/* Miniatura: al tocarla abre el comprobante en grande */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Ampliar comprobante"
        className="relative block aspect-[4/3] w-full cursor-zoom-in"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 448px) 100vw, 448px"
        />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          {/* Botón de cierre en la parte superior */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white backdrop-blur-sm active:scale-95"
          >
            ✕
          </button>

          {/* Imagen ampliada: object-contain para no recortar el comprobante */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative h-full max-h-[85vh] w-full max-w-3xl"
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
