# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`Front/` is the frontend of the **transparencia-donaciones** project — a donation
registration and transparency app. It is a Next.js 16 (App Router) + React 19 app
written in TypeScript. The repo root also contains `Back/`, a FastAPI backend; the
two are separate apps. UI copy is in Spanish (voseo: "Cargá", "Revisá").

The package manager is **pnpm** (see `pnpm-workspace.yaml`).

## Commands

```bash
pnpm dev            # Next dev server at http://localhost:3000
pnpm build          # Production build
pnpm start          # Serve the production build
pnpm lint           # ESLint (eslint-config-next: core-web-vitals + typescript)
pnpm test           # Run all tests once (vitest run)
pnpm test:watch     # Vitest in watch mode

# Run a single test file or filter by name
pnpm vitest run src/lib/donations/schema.test.ts
pnpm vitest run -t "requires exchangeRate when currency is BS"
```

Tests run in the **node** environment and only match `src/**/*.test.ts` (see
`vitest.config.ts`). Path alias `@/*` maps to `src/*`.

## Workflow

After producing a plan and **immediately before writing/editing any React code**
(components, hooks, JSX/TSX), invoke the `vercel-react-best-practices` skill and
follow its guidance. This applies only to React implementation work — skip it for
the planning phase and for non-React changes (schema, config, server actions
without JSX, tests).

## Architecture

The current feature is a single donation-registration form. The data flow:

`page.tsx` → `DonationForm` (client) → `registerDonation` server action → (TODO: FastAPI `Back/`)

- **`src/lib/donations/schema.ts`** is the single source of truth for validation.
  The same Zod `donationSchema` is reused on both sides: the client form via
  `@hookform/resolvers/zod`, and the server action via `safeParse`. Changes to
  validation rules belong here and propagate to both automatically.
- **`src/components/donation-form.tsx`** (`"use client"`) uses `react-hook-form`
  with `zodResolver`. On submit it builds a `FormData` (so the file upload works)
  and calls the server action inside `useTransition`, surfacing the returned
  `DonationActionState` (idle/success/error with optional `fieldErrors`).
- **`src/app/actions.ts`** (`"use server"`) re-validates server-side and returns a
  discriminated-union `DonationActionState`. **It does not yet POST to the backend** —
  there is a `TODO(Back)` to wire the multipart request once the FastAPI endpoint
  exists. Today a successful validation just returns a confirmation message.

### Key business rule

`exchangeRate` (tasa de cambio) is **required only when `currency === "BS"`**
(bolívares) and must be absent for USD/USDT. This is enforced in `donationSchema`
via `superRefine`, mirrored in the form (the field is disabled and cleared via
`resetField` when the currency isn't BS), and is the primary thing covered by
`schema.test.ts`. When touching currency/rate logic, keep all three in sync and
update the schema tests.

The reference image is a required upload (`File`): max 5 MB, JPG/PNG/WEBP only.

## Styling

Tailwind CSS v4 (via `@tailwindcss/postcss`, no `tailwind.config`). Theme tokens
`foreground`/`background` and the Geist fonts are defined in `src/app/globals.css`
and `src/app/layout.tsx`. Form field/label/error class strings are defined once at
the top of `donation-form.tsx` and reused.
