---
tags:
  - archive
  - summa
---
# Summa-era vault snapshot

These notes describe the Summa Next.js landing that was replaced by the Palm Inversiones vanilla HTML landing on 2026-06-01. The underlying code is preserved in git history — last Summa commit is `431a418` ("feat: redesign landing page — 8 sections, glassmorphism, alternating dark/light").

The notes are kept for the *why* behind decisions (hardcoded social-proof counter, doubled env-var prefix, no animation library). Active Palm context lives at the top of `vault/`.

To recover code: `git checkout 431a418 -- app/ components/ hooks/ __tests__/`.
