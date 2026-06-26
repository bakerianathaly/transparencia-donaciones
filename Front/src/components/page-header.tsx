import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  children: ReactNode;
}

export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="rise flex flex-col gap-3">
      <span className="inline-flex items-center gap-2 self-start rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-strong">
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
        Centro de Acopio
      </span>
      <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight">
        {title}
      </h1>
      <p className="text-base leading-relaxed text-muted">{children}</p>
    </header>
  );
}
