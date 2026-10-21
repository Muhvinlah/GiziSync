# QWEN.md — Project Guidelines for GiziSync

## Project Overview

**GiziSync** is a web application built on **Next.js 15 (App Router)**, **React 19**, and **TypeScript**, integrated with **Supabase** for backend authentication, database, and real-time features. The UI is built using **Tailwind CSS**, **Radix UI** primitives (configured via **shadcn/ui** New York style), and **Lucide React** icons, supporting dark and light themes through `next-themes`.

### Core Tech Stack

- **Framework:** Next.js 15 (App Router with `cacheComponents` and `partialPrefetching` enabled)
- **Language:** TypeScript 5 (Strict mode, ES2017+ target, `@/*` path aliases)
- **UI & Components:** React 19, Tailwind CSS 3.4, `tailwindcss-animate`, Radix UI primitives, `lucide-react`
- **Backend & Auth:** Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- **Theming:** `next-themes` (system, dark, light modes with CSS variables)
- **Linter & Code Quality:** ESLint 9 (flat configuration with `FlatCompat`), Next.js Core Web Vitals

---

## Directory Structure

```text
gizisync/
├── app/                        # Next.js App Router pages and route handlers
│   ├── auth/                   # Authentication routes
│   │   ├── confirm/route.ts    # Supabase email/token confirmation handler
│   │   ├── error/page.tsx      # Auth error fallback page
│   │   ├── forgot-password/    # Password recovery request page
│   │   ├── login/page.tsx      # User sign-in page
│   │   ├── sign-up/page.tsx    # User registration page
│   │   ├── sign-up-success/    # Post-registration confirmation notice
│   │   └── update-password/    # Password reset submission page
│   ├── protected/              # Authenticated-only routes & layouts
│   │   ├── layout.tsx          # Protected route header & navigation layout
│   │   └── page.tsx            # Protected dashboard / user details view
│   ├── globals.css             # Tailwind base styles, theme variables, and HSL colors
│   ├── layout.tsx              # Root HTML layout with Geist font & ThemeProvider
│   └── page.tsx                # Public landing page
├── components/                 # React components
│   ├── ui/                     # Reusable shadcn/ui primitives (button, card, input, etc.)
│   ├── tutorial/               # Onboarding and documentation steps
│   ├── auth-button.tsx         # Dynamic login/logout user state button
│   ├── login-form.tsx          # Client-side login form component
│   ├── sign-up-form.tsx        # Client-side registration form component
│   └── theme-switcher.tsx      # Light/dark mode dropdown toggle
├── lib/                        # Shared utility functions and client configs
│   ├── supabase/
│   │   ├── client.ts           # Browser-side Supabase client (createBrowserClient)
│   │   ├── server.ts           # Server-side Supabase client (createServerClient + cookies)
│   │   └── proxy.ts            # Session refresh and route guard logic
│   └── utils.ts                # Class merging utility (cn helper with clsx + tailwind-merge)
├── proxy.ts                    # Root request proxy / middleware entry point
├── components.json             # shadcn/ui configuration file (New York style)
├── next.config.ts              # Next.js compiler and experimental configuration
├── tailwind.config.ts          # Tailwind theme tokens and color mappings
├── tsconfig.json               # TypeScript compiler options and path mappings
└── package.json                # Project dependencies and npm scripts
```

---

## Building and Running

### Prerequisites

- **Node.js:** v20+ recommended
- **Package Manager:** `npm` (uses `package-lock.json`)
- **Supabase Account/Project:** A running Supabase project (cloud or local via Supabase CLI)

### Environment Configuration

Copy `.env.example` to `.env.local` and populate your Supabase credentials:

```bash
cp .env.example .env.local
```

Required environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-anon-or-publishable-key>
```

> **Note:** `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` supports both legacy anon keys and new publishable keys.

### Available Scripts

| Command | Action | Description |
| :--- | :--- | :--- |
| `npm run dev` | Start development server | Launches Next.js on `http://localhost:3000` |
| `npm run build` | Build for production | Compiles application with Next.js App Router |
| `npm run start` | Run production build | Starts Next.js production server |
| `npm run lint` | Run code linter | Runs ESLint 9 across project files |

---

## Supabase Authentication & Session Architecture

The application strictly implements cookie-based authentication via `@supabase/ssr` across three execution contexts:

1. **Client Components (`lib/supabase/client.ts`):**
   - Call `createClient()` using `createBrowserClient`.
   - Used inside form handlers (`login-form.tsx`, `sign-up-form.tsx`) for interactive authentication actions (`signInWithPassword`, `signUp`, `signOut`).
2. **Server Components & Route Handlers (`lib/supabase/server.ts`):**
   - Call `await createClient()` inside async Server Components.
   - Accesses request cookies via `next/headers`'s `cookies()`.
   - **Critical rule:** Never store the server client in a global variable (to remain compatible with Fluid compute). Create a new instance within each function call.
   - Verify user sessions via `supabase.auth.getClaims()` rather than storing unsynced user objects.
3. **Proxy / Middleware (`proxy.ts` & `lib/supabase/proxy.ts`):**
   - Executes before request dispatch to refresh auth tokens and forward updated cookies.
   - Guards authenticated routes: redirects unauthenticated requests targeting protected routes to `/auth/login`.

---

## Development Conventions & Best Practices

### Component Architecture

- **Server-First by Default:** All files in `app/` are React Server Components unless explicitly marked with `"use client"`. Keep data fetching and sensitive logic in Server Components.
- **Client Components:** Mark interactive components (forms, dialogs, dropdowns, event listeners) with `"use client"` at the very top.
- **Shadcn UI Primitives:** Place low-level atomic UI components inside `components/ui/`. Compose domain-specific UI in `components/`.

### Styling & Theming

- Use Tailwind CSS utility classes directly.
- Merge dynamic class names exclusively with `cn(...)` from `@/lib/utils`:
  ```tsx
  import { cn } from "@/lib/utils";

  export function Card({ className, ...props }: React.ComponentProps<"div">) {
    return <div className={cn("rounded-lg border bg-card p-4", className)} {...props} />;
  }
  ```
- Use CSS variable color tokens defined in `app/globals.css` (`bg-background`, `text-foreground`, `bg-primary`, `border-border`, etc.) to support both light and dark modes automatically.

### TypeScript & Imports

- Use path alias `@/*` to reference files from the project root (e.g. `@/components/ui/button`, `@/lib/supabase/server`).
- Prefer exact typing over `any`. Avoid redundant type assertions where TypeScript can infer returns.

### ESLint & Build Notes

- When running linting, ensure generated folders such as `.next/` are excluded.
- Avoid using CommonJS `require()` in TypeScript configuration files; use ES Module `import` syntax where feasible.
