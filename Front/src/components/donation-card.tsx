import type { ReactNode } from "react";

interface DonationCardProps {
  title: string;
  badge?: string;
  children: ReactNode;
}

export default function DonationCard({
  title,
  badge,
  children,
}: DonationCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-foreground">
          {title}
        </h2>
        {badge ? (
          <span className="bg-accent-soft text-accent-strong rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </article>
  );
}
