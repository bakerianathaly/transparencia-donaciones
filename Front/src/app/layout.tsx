import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

// Serif con carácter para los títulos: gravedad y calidez humana.
// Solo el peso 600 (único usado en la UI) para no cargar pesos muertos.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600"],
});

// Grotesca limpia y muy legible para el cuerpo y los campos del formulario.
const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Centro de Acopio · Registro de donaciones",
  description:
    "Centro de acopio para Venezuela. Registrá tu donación y su comprobante de forma rápida y segura.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${hankenGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {/* Franja de acento a sangre: urgencia presente, pero contenida. */}
        <div aria-hidden className="h-1.5 w-full shrink-0 bg-accent" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
