---
tags:
  - concepts
  - seo
---
# SEO & AI-search

How Palm is made discoverable to search engines **and** AI assistants (ChatGPT, Claude, Perplexity, Gemini). Added 2026-06-09 on top of the production app at `palminversiones.com`.

> Goal stated by the founder: "appear on the AI searches." The lever for that is not marketing copy — it's letting AI crawlers in, plus clean structured facts they can quote.

## What exists (files)
- `app/layout.tsx` — rich `metadata`: title + template, Spanish description, keywords, `metadataBase` (`https://palminversiones.com`), `openGraph` (locale `es_AR`) + `twitter` cards, robots directives. `viewport.themeColor`. **Canonical does NOT live here** (2026-06-11): in the layout it leaked to every page that didn't override it (the noindex `/animaciones` + `/cards-nuevas` pointed at home — contradictory signals). Each `page.tsx` declares its own; home's is in `app/page.tsx`.
- `app/robots.ts` → `/robots.txt` — allows `*` **and explicitly allows the AI agents** (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Amazonbot, CCBot, cohere-ai). Points to the sitemap.
- `app/sitemap.ts` → `/sitemap.xml` — `/`, `/preguntas-frecuentes`, `/terminos`, `/privacidad`. `lastModified` is a **hand-maintained constant per page** (was `new Date()`, which stamped every deploy as "just modified" and taught crawlers the field was noise) — update it when a page's content actually changes.
- `app/manifest.ts` → `/manifest.webmanifest` — PWA basics, theme `#101B3B`.
- `app/opengraph-image.tsx` → `/opengraph-image` — dynamically generated 1200×630 social card (navy + gradient bar, "De ahorrista a inversor."). Builds and runs on the OpenNext/Cloudflare adapter.
- `components/StructuredData.tsx` — JSON-LD on the home page: `FinancialService` (org) + `WebSite`. Since 2026-06-11 the org carries `makesOffer` with both plans (free + $14.999 ARS `unitCode: MON`, `availability: PreOrder` while the app is waitlist-only) — **mirror of `components/Pillars.tsx`; change them in the same commit** — and `sameAs` with the three founder-confirmed socials (Instagram, X, LinkedIn).
- `app/terminos/page.tsx` + `app/privacidad/page.tsx` (2026-06-11) — site-scoped legal pages (the app will ship its own at launch). Grounded only in claims already public on the landing; privacy honestly states the site's sole datum is the waitlist email (no cookies/analytics — verified). Both carry a `TODO(founder)`: add the legal entity and get lawyer review. Footer links point at them (the old `href="#"` dead links + the "Cookies" link are gone).
- `lib/faq.ts` — **single source of truth** for the FAQ.
- `app/preguntas-frecuentes/page.tsx` — visible FAQ page (accessible `<details>` accordion) **plus** the `FAQPage` JSON-LD, both built from `lib/faq.ts`.
- `public/llms.txt` — plain-language brief for LLM crawlers: what Palm is, who it's for, plans, differentiators, regulation, links. Since 2026-06-11 it has a **"Disponibilidad"** section (app not in stores yet → waitlist), matching the rewritten "¿Cómo empiezo?" FAQ — both must flip back to download copy at launch.

## Why these choices
**Why allow AI crawlers explicitly:** assistants only cite sites whose bots are permitted. Most sites silently block them; we opt in.
**Why FAQPage lives on `/preguntas-frecuentes`, not home:** Google requires FAQ structured data to match a *visible* FAQ on that URL. Home has no visible FAQ, so its earlier inline FAQPage was removed — home keeps only Organization + WebSite.
**Why a single `lib/faq.ts`:** the visible answers and the JSON-LD must never drift, or the structured data is invalid.
**Why no "con IA" copy:** see [[Decisions]] — AI hype is a credibility risk for an Argentine fintech. AI-search visibility comes from structure (robots + schema + llms.txt), not buzzwords.

## How to apply / maintain
- **Edit FAQs in `lib/faq.ts` only** — both the page and the JSON-LD update together.
- **Keep every claim grounded in on-page copy.** The differentiators (sin comisiones ocultas, no vende tus datos, cartera personalizada, regulado por CNV, broker Alfy) are all already public on the landing.
- **Price:** `$14.999 ARS / mes` for the paid tier — match `components/Pillars.tsx`. (Brand notes in `[[../brand/Palm Inversiones]]` mention USD 12.50; the live ARS price is authoritative.)
- **Canonical / metadataBase** is hardcoded to `https://palminversiones.com`. If the domain changes, update `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, `components/StructuredData.tsx`, `app/preguntas-frecuentes/page.tsx`, `public/llms.txt`.
- The FAQ page is linked from the **footer**, not the burger menu — the menu stays main-page-section-only (see [[Decisions]]).

## Not done (future)
- Submit the site + sitemap to Google Search Console.
- `Review` / `AggregateRating` schema once real beta-tester quotes exist.
- A hand-designed OG image (the generated one is a clean placeholder).

## See also
- [[Decisions]] — "no con IA" rule; menu = main-page sections only
- [[../brand/Palm Inversiones]] — positioning the FAQ/llms.txt draw from
- [[../brand/Voice]] — rioplatense voseo (the FAQ answers follow it)
