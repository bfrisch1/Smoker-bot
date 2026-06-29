# Butcher's Log — BBQ Smoke & Temperature Companion

Turn a "dumb" dual-probe smoke receiver (e.g. ThermoWorks Smoke) into a logged,
plotted cook history. Create a cook, assign each probe a role (grate vs. meat),
then snap a photo of the receiver throughout the cook — Claude reads the two
temperatures off the photo and plots them on a hand-drawn ledger graph. Log
events (spritz, wrap, photo) as pins, and review a per-cook summary afterward.

Vintage parchment butcher-shop theme. Mobile-first.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Neon** (PostgreSQL) via Drizzle ORM
- **Vercel Blob** for receiver photos
- **Anthropic Claude** (`claude-sonnet-4-6`) vision for reading temps
- **Tailwind CSS** + custom design tokens
- Fonts: Ultra, Spectral, Space Mono

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
ANTHROPIC_API_KEY=sk-ant-...        # Claude vision
DATABASE_URL=postgresql://...        # Neon pooled connection string
BLOB_READ_WRITE_TOKEN=vercel_...     # Vercel Blob store token
```

## Setup

```bash
npm install
npm run db:push      # create the tables in Neon (needs DATABASE_URL)
npm run dev          # http://localhost:3000
```

## Deploy to Vercel

1. **Create the project**: Vercel → Add New → Project → import this repo.
2. **Add Blob storage**: in the project, Storage → Create → Blob. Vercel wires
   `BLOB_READ_WRITE_TOKEN` in automatically.
3. **Add a Neon database**: either via Vercel's Neon integration (Storage →
   Create → Neon) or paste your own `DATABASE_URL` under Settings →
   Environment Variables.
4. **Add `ANTHROPIC_API_KEY`** under Settings → Environment Variables.
5. **Create the tables**: run `npm run db:push` locally against the production
   `DATABASE_URL` (or as a deploy step).
6. Deploy.

## Data model

- **sessions** — name, cut type, probe roles, start/end, done-target temp, notes
- **readings** — timestamp, grate temp, meat temp, source (photo/manual), photo URL
- **events** — timestamp, type (spritz/wrap/photo/custom), note, photo URL

## How the photo read works

`POST /api/sessions/[id]/readings` with a multipart image uploads the photo to
Blob and sends it to Claude, which returns the two probe temperatures as JSON.
The values are mapped to grate/meat using the session's probe roles, shown for
confirmation/correction, then saved via a JSON `POST` to the same route.
