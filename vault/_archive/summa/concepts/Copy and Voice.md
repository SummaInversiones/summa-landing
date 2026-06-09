---
tags:
  - concepts
  - copy
  - voice
---
# Copy and Voice

## Language
**Argentine Spanish (`es_AR`).** Set in `app/layout.tsx` (`<html lang="es">` + OpenGraph `locale: 'es_AR'`).

## Voseo
Use **vos**, not **tú**. Imperatives end in stressed `-á / -é / -í`:
- ✅ "Arrancá ahora", "Invertí con inteligencia", "Preguntá lo que quieras"
- ❌ "Empieza", "Invierte"

## Tone
- Conversational, warm, slightly playful — but not cute.
- Promises framed in plain money terms ("por lo mismo que pagás Netflix").
- No financial jargon unless explained immediately.
- Trust language is restrained and concrete: regulator name (CNV), partner name (Allaria), human supervision. No vague "bank-grade security."

## Recurring phrases (do not paraphrase casually)
- **Tagline / metadata title:** *"Summa — Invertí con inteligencia"*
- **OG description:** *"Tu plata, trabajando para vos."*
- **Hero H1:** *"Invertir debería ser para la gente, arrancá ahora por lo mismo que pagás Netflix."*
- **Hero subhead:** *"Summa es tu asesor financiero que realmente es tuyo. Con IA que logra manejar tus inversiones de forma inteligente, segura y adaptada a tus necesidades. Sin complicaciones, sin letra chica."*
- **CTA buttons:** "Quiero mi asesor →" (hero), "Acceso Anticipado" (nav), "Quiero invertir →" (waitlist form).
- **Success state:** *"Ya estás en la lista."*
- **Error state:** *"Algo salió mal. Intentá de nuevo."*

## Numbers
The "+847 personas ya están en la lista de espera" counter under the hero CTA is **hardcoded**, not live from Redis. Intentional — see [[../history/Decisions|Decisions]].

## When adding copy
- Keep the voseo.
- Avoid English unless it's a brand term ("Acceso Anticipado" not "Early Access").
- Run finished copy past the design system's tone before merging.
