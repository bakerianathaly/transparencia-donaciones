"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/compras", label: "Compra", full: "Registrar compra" },
  { href: "/resumen", label: "Resumen", full: "Ver resumen" },
  { href: "/registro", label: "Donación", full: "Registrar donación" },
  { href: "/donaciones", label: "Listado", full: "Listado de donaciones" },
] as const;

const baseItem =
  "flex-1 rounded-xl px-3 py-2.5 text-center text-sm font-semibold transition active:scale-[0.98]";
const activeItem =
  "bg-accent text-white shadow-md";
const inactiveItem =
  "border border-accent/40 bg-accent-soft text-accent-strong hover:bg-accent/10 hover:border-accent";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-md items-center gap-2 px-5 py-3">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-label={link.full}
              aria-current={isActive ? "page" : undefined}
              className={`${baseItem} ${isActive ? activeItem : inactiveItem}`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
