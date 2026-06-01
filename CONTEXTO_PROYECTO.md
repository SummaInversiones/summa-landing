# Palm Inversiones — Contexto del proyecto

Documento de traspaso para retomar el trabajo en una sesión nueva sin perder contexto.

---

## 1 · Qué es el proyecto

**Palm Inversiones** — landing page de una fintech argentina (App de inversiones + tracking de portfolio + asesoramiento financiero). Brief implícito:

- **Audiencia**: ahorristas argentinos (25–45) que querés convertir en inversores. No saben de finanzas pero tienen hábito de ahorro.
- **Voz de marca**: "amigo que entiende de plata" — editorial, friendly pero disciplinado, en castellano rioplatense (voseo: "vos", "bajate", "anotate", "plata").
- **Objetivo de la página**: empujar download del App Store / Google Play y mostrar la propuesta de valor con una calculadora interactiva ("Vos solo vs con Palm").

### Stack real

- **Vanilla HTML/CSS/JS** en un único archivo `index.html`. **No hay** `package.json`, **no hay** bundler, **no hay** React/Vue/Svelte, **no hay** Tailwind, **no hay** TypeScript.
- Toda dependencia externa se carga por **ESM CDN** dentro de `<script type="module">` (Three.js, Motion, mathjs).
- Fonts: Neue Haas Grotesk Pro auto-hosteadas (`@font-face` apuntando a `fonts/`) + IBM Plex Sans desde Google Fonts (un único `<link>`).

### Cómo se levanta en local

El proyecto está configurado para levantarse con `npx serve` en el puerto **3000**:

```
http://localhost:3000
```

La config vive en `.claude/launch.json` con dos opciones (`npx serve` por default, `npx live-server` con auto-reload como alternativa). Cualquier servidor estático sirve.

**Importante**: el archivo NO se puede abrir con `file://` directo porque las `@font-face` con rutas relativas no se resuelven sin un servidor HTTP.

---

## 2 · Estructura de archivos

```
summa-landing/                    ← repo root after migration
├── index.html                    ← Todo: HTML + CSS inline + JS inline (~2300 líneas)
├── CONTEXTO_PROYECTO.md          ← Este archivo
├── Palm logo gradient.png        ← Asset original del logo (referencia)
├── Image P.png                   ← Asset original de la figura del problem (referencia)
│
├── .claude/
│   ├── launch.json               ← Config de dev server (npx serve / live-server)
│   └── settings.local.json       ← Settings de Claude Code (permissions)
│
├── fonts/                        ← Auto-hosting de Neue Haas Grotesk Pro
│   ├── NHaasGroteskDSPro-15UltTh.otf   (weight 150)
│   ├── NHaasGroteskDSPro-25Th.otf      (weight 200)
│   ├── NHaasGroteskDSPro-55Rg.otf      (weight 400)
│   ├── NHaasGroteskTXPro-65Md.ttf      (weight 500)
│   └── NHaasGroteskTXPro-75Bd.ttf      (weight 700)
│
└── mockups/                      ← Screenshots de la app + assets visuales
    ├── palm-logo.png             ← Logo gradient (navbar + footer)
    ├── Hero-section.png          ← iPhone con palm·invest (gold-bezeled, hero asymmetric)
    ├── hero-hand.png             ← Versión anterior con mano (no se usa actualmente)
    ├── problem-figure.png        ← Hombre cerrando los ojos en forma de P (problem section)
    ├── screen-extracto.png       ← "Cargá tu primer extracto · PASO 07 / 09" (step 01)
    ├── screen-gastos.png         ← Donut de gastos por categoría (step 02)
    ├── screen-objetivo.png       ← Apartamento propio + progress ring 16% (step 03)
    ├── screen-portfolio.png      ← Tickers CSCO/AVGO/NVDA/PANW (step 04)
    └── screen-proyeccion.png     ← Vos solo vs con Palm 12/6 años (sin usar actualmente)
```

Notas:
- `Hand mockup.png` y los `Screenshot 2026-05-27 …` son copias originales antes del renombrado — quedaron por seguridad.
- `hero-hand.png` y `screen-proyeccion.png` están en el folder pero no se referencian desde `index.html` actualmente.

---

## 3 · Estado actual — secciones

Orden vertical de la página (top → bottom):

### 3.1 Navbar
- **Archetype**: N5 Floating pill — píldora flotante, blur backdrop, separada 20px del borde superior, max-width 720px centrada (compresa a 640px al scrollear más de 200px).
- **Contenido**: logo gradient + wordmark "Palm" a la izquierda, CTA gold "Bajate la app" + burger icon a la derecha.
- **Sin links inline en desktop** — todos los nav-links viven en la sheet-menu del burger (mismo nav en mobile y desktop).
- Sticky con `top: 20px`. JS minimal: toggle `.scrolled` past 200px, toggle `.open` del overlay del burger.

### 3.2 Hero (asymmetric)
- **Layout desktop (≥ 880px)**: grilla 2-col `1.1fr / 1fr`. Copy a la izquierda, iPhone mockup (`mockups/Hero-section.png`) a la derecha.
- **Layout mobile**: stack — copy arriba, iPhone abajo.
- **Background**: shader Three.js (líneas de colores RGB animadas) sobre `var(--brand-gradient)` de fallback, con scrim navy 62% encima para legibilidad.
- **Contenido**:
  - Headline: "Todo argentino bien asesorado puede pasar de ahorrista a `inversor`." (la palabra "inversor" tiene `.kw` italic gold)
  - Subhead: "Tu asesor financiero personal. Sin letra chica, sin sorpresas."
  - Dos store buttons (App Store + Google Play) inline en desktop, stack en mobile
- **NO tiene**: badge pill ("Acceso anticipado · Argentina 🇦🇷"), welcome block ("Bienvenido a Palm"), texto "con IA" — todos fueron removidos deliberadamente (ver decisiones).

### 3.3 Marquee ticker
- Banda angosta entre hero y problem.
- Scrollea horizontal infinito (CSS keyframe `marquee`, 25s linear).
- Contenido: "Regulado por CNV · Broker partner: Alfy Inversiones · Hecho en Argentina 🇦🇷 · Tu capital, siempre protegido" (× 3 para loop seamless).
- Bordes superior e inferior con `var(--brand-gradient)` al 25% opacity.

### 3.4 Problem
- **Layout desktop (≥ 860px)**: grilla 2-col `1.1fr / minmax(280px, 1fr)`. Texto a la izquierda, figura a la derecha.
- **Layout mobile**: stack — texto arriba, figura abajo (orden cambió por pedido explícito del usuario).
- Headline: "Siempre tuvimos que `mirar de lejos` al mundo financiero."
- Divider gradient corto (64px, brand-gradient).
- "Hasta ahora." en gold italic Plex (NO gradient text-fill — ver decisiones).
- Figura: `mockups/problem-figure.png` — foto editorial recortada en forma de P, con halo suave radial detrás.

### 3.5 Process (4 pasos letter-format)
- `<ol class="steps">` con 4 `<li class="step">`.
- Cada step: número grande en gold a la izquierda (margen) + screenshot + heading + body.
- **Desktop**: 3 columnas (`80px / minmax(280px, 1fr) / minmax(280px, 1.1fr)`) con screenshot y copy alternando lados según paridad del step (impar = screenshot izq, par = screenshot der).
- **Mobile**: stack vertical.
- Hairlines entre steps. NO cards, NO bordes, NO fondos.
- Screenshots SIN bezel CSS (drop-shadow suave únicamente).
- Steps:
  1. "Tu `resumen bancario`. El punto de partida." → `screen-extracto.png`
  2. "`Cuentas claras`, problemas claros." → `screen-gastos.png`
  3. "Tus `objetivos`, a tu alcance." → `screen-objetivo.png`
  4. "Tu `portafolio`. Armado solo para vos." → `screen-portfolio.png`

### 3.6 Pillars
- 2 cards lado a lado en desktop, stack en mobile.
- **Pillar 1** (Gratuita): "Gestión financiera `inteligente`" — typography-only, 3 features con checkmark gold, CTA "Descargar gratis →". NO tiene screenshot (fue removido a pedido del usuario).
- **Pillar 2** (Pago): "Asesoramiento `personalizado` de inversiones" badge "USD 12.50 / mes" — typography-only, 3 features con checkmark violeta, CTA "Quiero invertir →" + nota "Acceso por invitación". NO tiene calculadora ni screenshot (calc fue promovida a su propia sección — ver siguiente).
- Ambos pillars con border gradient top de 3px (brand-gradient).
- Resultado: dos cards visualmente simétricas (typography-only). La asimetría visual ahora la hace la sección calculadora abajo.

### 3.7 Calculadora (sección propia)
- **NUEVA sección standalone** entre Pillars y Seguridad.
- Layout: head centrado + widget calc centrado, max-width 560px.
- Head:
  - Eyebrow gold caps: "Probálo en vivo"
  - Headline: "Hacé el `cálculo`."
  - Lede: "Movés el aporte mensual y elegís un objetivo. Te mostramos en cuántos años llegás solo y cuántos te ahorrás con Palm."
- Widget:
  - Input range "Aporte mensual" (20k–500k ARS, step 5k, default 95k)
  - Select "Objetivo" (5M / 14M / 50M / 100M ARS)
  - Hairline divider
  - Resultado: Vos solo (cream) → arrow → Con Palm (gold), número grande tabular nums
  - "Te ahorrás N años de tu vida." con N en gold italic Plex
  - Disclaimer: "Cálculo orientativo. Asume 0% sobre el ahorro y 15% anual con Palm. Las inversiones tienen riesgo."
- **Cálculo**: mathjs `compile('log(1 + FV * r / PMT) / log(1 + r)')` (tiempo a target en annuity compuesta). Lazy-load del CDN cuando la sección entra en viewport.

### 3.8 Seguridad (Statement Letter)
- Sobre navy, NO sobre cream/blanco.
- Eyebrow: "REGULADO POR CNV"
- Headline: "Tu seguridad es nuestra `prioridad`."
- Lede párrafo + brand-gradient rule corto.
- 4 trust signals como `<dl>` con `<dt class="signal-lead">` (cream weight 500) + `<dd class="signal-body">` (cream-62% weight 400). Hairlines entre signals.
- Partner strip al cierre: "Regulado por CNV, con Alfy Inversiones como broker partner. / Hecho en Argentina." (sin middle-dot separators — fue dieta de dots).
- Hover: hairline arriba del signal pasa de cream-8% a gold-25%. Solo una señal por elemento.

### 3.9 CTA Final (Statement Letter, navy)
- Antes era sandwich-gradient (centered, brand-gradient bg) — se rompió a pedido del taste-skill audit.
- Ahora: navy + Statement Letter, left-aligned.
- Headline: "Tu futuro comienza `hoy`."
- Body: "El primer paso es saber dónde estás parado. Cuanto antes empieces, antes llegás a tu objetivo."
- Rule gradient corto.
- Dos store buttons (App Store solid + Play Store ghost).
- "Seguinos en `@palm.inversiones`" cerrando (sin emoji 📱 — fue removido).

### 3.10 Footer
- Una sola línea: logo + wordmark "Palm" (60% opacity), copyright "© 2025 Palm · Regulado por CNV · Hecho en Argentina 🇦🇷", links "Términos de uso · Política de privacidad".
- Border-top gradient al 25%.

### 3.11 GradualBlur (overlay fijo)
- Vive como `<div class="gradual-blur gradual-blur--bottom">` fuera de las secciones, `position: fixed`, anclado al `bottom: 0` del viewport.
- 5 layers stackeadas con `backdrop-filter: blur()` creciente exponencial (0.5 → 1.5 → 3 → 6 → 12 px), cada layer con su `mask-image: linear-gradient()` para fundido suave entre niveles.
- z-index: 50 (debajo del navbar pill, encima del contenido).
- Honors `prefers-reduced-transparency: reduce` (se desactiva).
- Persiste durante todo el scroll del page.

---

## 4 · Decisiones de diseño — el "por qué" (no revertir sin razón)

Cada una de estas decisiones tiene un motivo, casi siempre validado por las skills `hallmark`, `ui-ux-pro-max` y `design-taste-frontend` que se corrieron en sesión.

### Paleta y tipografía — bloqueadas

- **Paleta**: `--navy: #101B3B`, `--gold: #F0C14D`, `--blue: #26428B`, `--violet: #9747FF`, `--cream: #FFFCF5`, `--dark: #0A1428`. Tokens RGB (`--cream-rgb`, `--gold-rgb`, `--navy-rgb`) agregados para `rgba()` sin hex literals mid-render.
- **Tipografía principal**: Neue Haas Grotesk Pro (todo el body, headings, UI).
- **Tipografía secundaria**: IBM Plex Sans **italic medium gold** para keywords — la clase `.kw`. Se aplica a palabras-ancla por sección (ej: "inversor", "cartera", "perfil de inversor", "mirar de lejos", "Hasta ahora", "diagnóstico real", "plan concreto", "prioridad", "cálculo", "hoy").
- **Sin third typeface**: se probó Playfair Display en la security section, se removió por violar la regla de 2 fonts.

### Page Theme Lock — siempre navy

- **Toda** la página rinde sobre navy. NO hay sección cream/blanca. Si una sección intenta romper el theme (caso security original con Playfair + cream), eso es un anti-pattern (Hallmark Page Theme Lock).
- Excepción: el hero tiene el shader RGB encima del brand-gradient como fondo, pero queda visualmente navy gracias al scrim navy-62%.

### Anti-patterns que se evitan deliberadamente

| Anti-pattern | Por qué se evita | Dónde estaba antes |
|---|---|---|
| Gradient text-fill en headlines | Tell #1 de página AI-generated | "Hasta ahora." antes era brand-gradient via background-clip:text. Ahora es gold italic Plex. |
| Centered hero + 100vh | §4.3 ANTI-CENTER BIAS para variance > 4 | Hero era centered con min-height: 100vh. Ahora es asymmetric grid. |
| Badge pill con emoji-país | §9.F version-label pattern + §3.D emoji policy | Hero tenía "ACCESO ANTICIPADO · ARGENTINA 🇦🇷". Removido. |
| Welcome block "Bienvenido a Palm" | Copy register break + redundante con headline | Estaba debajo del headline. Removido. |
| Icon-tile feature grid (3-4 cards con icon-square + título + body) | Template SaaS canónico | Security tenía 4 cards. Ahora es Statement Letter sin cards ni íconos. |
| Phone bezel CSS alrededor de screenshots | Re-drawn UI chrome anti-pattern | Steps tenían bezel + notch. Ahora screenshots con drop-shadow únicamente. |
| Hover universal (translateY + scale + shadow) | §4.5 banal | Casi todos los elementos lo tenían. Ahora: una señal por elemento (color o border). |
| Sandwich brand-gradient (hero + CTA-final ambos centered + gradient) | Macro-rhythm tell | CTA-final era gradient centrado. Ahora navy + Statement Letter. |
| Patrón "P" repetido bajo opacidad | Decoración no motivada | Estaba en hero + process + cta-final. Removido en todo el site. |
| Middle-dot inflation (·) | §9.F max 1 per line | Trust strip tenía 2 dots. Ahora frase con coma + punto. Marquee mantiene los dots porque la función es separar items en ticker. |
| Eyebrow en cada sección | §4.7 eyebrow restraint (max 1 cada 3 secciones) | Process y Pillars tenían eyebrow. Removidos. Solo Security y Calculadora tienen. |

### Decisiones controvertidas que se mantienen

- **Shader Three.js en hero**: por estricto criterio de taste-skill no está "motivado" (decorativo, no comunica hierarchy/storytelling/feedback). Pero **el usuario lo prefiere**. Se mantiene. Pausa cuando el hero está offscreen para no quemar GPU.
- **GradualBlur fijo en bottom viewport**: persiste todo el page, atraviesa el contenido. Funciona como signature visual. Se mantiene.
- **Calculadora con datos hardcodeados (0% solo / 15% palm)**: declarado en el disclaimer. No es métrica inventada porque está labelled.

---

## 5 · Motion / animaciones — lo que está vivo

Tres librerías externas, **todas cargadas por ESM-CDN dentro de `<script type="module">`** al final del `<body>`. NO hay npm, NO hay bundler — el navegador resuelve los imports directos del CDN.

### 5.1 Three.js — shader del hero
- CDN: `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js`
- Lazy import dentro del primer `<script type="module">`.
- Renderiza un fragment shader full-viewport en `#shader-bg` (líneas de colores RGB animadas).
- Pausa cuando el `.hero` sale del viewport (IntersectionObserver).
- `pixelRatio` capeado a 2.
- Honors `prefers-reduced-motion` y `WebGL` feature detection — si fallan, queda visible el brand-gradient fallback.

### 5.2 Motion — animaciones de elementos
- CDN: `https://cdn.jsdelivr.net/npm/motion@11.18.0/+esm`
- Importa `animate` e `inView`.
- **Qué anima exactamente**:
  - **Pillar phone wrappers (`.pillar-phone-wrap`)**: entrance fade + scale + rotateX (`y: 28 → 0, scale: 0.92 → 1, rotateX: -18° → 0°`), después arranca idle infinito (`y` flotando + `rotateY` wobble suave). **Pillar 1 ya no tiene phone, y la calculadora reemplazó la de Pillar 2**, así que actualmente este código no encuentra elementos para animar (queda inerte sin error).
  - **Inner phone-mockup (`.pillar-phone-wrap .phone-mockup`)**: tilt 3D que sigue el cursor (rotateX/rotateY mapeados desde la posición del mouse, capeado a ±10°), con scale 1.04 al hover y reset suave al leave. Solo en `@media (hover: hover) and (pointer: fine)`. Mismo caveat: no hay targets actualmente.
  - **Hero hand-mockup (`.hero-handshot`)**: reemplaza el CSS keyframe `float` por un Motion-driven `y: [0, -10, 0]` + `rotate: [0, 0.6°, 0, -0.6°, 0]` infinito 6s. La CSS keyframe se desactiva con `style.animation = 'none'`.
- Honors `prefers-reduced-motion`.

> Note: cuando promueva la calculadora a sección propia y se removieron los phone screenshots de pillars, el motion code de pillar-phones quedó "buscando elementos que ya no están". No rompe nada (forEach sobre nodelist vacío), pero es código muerto. Limpiar en próxima pasada.

### 5.3 mathjs — calculadora
- CDN: `https://cdn.jsdelivr.net/npm/mathjs@13.2.0/+esm`
- **Lazy-loaded**: solo se importa cuando la sección `.calc` entra dentro de 200px del viewport (IntersectionObserver con rootMargin).
- Pre-fallback con `Math.log` nativo así el primer paint muestra valores correctos aunque mathjs no haya llegado todavía.
- Compila una sola vez la expresión `log(1 + FV * r / PMT) / log(1 + r)` y la evalúa con `{FV, PMT, r}` en cada input event.
- Formato de números: `Intl.NumberFormat('es-AR')` (NO mathjs — la herramienta correcta para locale).

### 5.4 IntersectionObserver scroll-reveal (vanilla, no librería)
- Class `.reveal` con opcionales `data-delay="100/200/300/400/500"` ms.
- Un IO global observa todos los `.reveal`; agrega `.in` al entrar al viewport con threshold 0.15.
- Stagger por sección con los `data-delay`.

### 5.5 Marquee ticker (CSS puro)
- `@keyframes marquee` translateX(-50%), 25s linear infinite.
- Contenido duplicado 3 veces para loop seamless.

### 5.6 GradualBlur (CSS puro)
- 5 layers stackeadas con `backdrop-filter` y `mask-image` gradients.
- Sin JS — todo CSS.

---

## 6 · Deuda técnica / pendientes

### CSS huérfano (no rompe nada, pesa unas pocas líneas)

- **`.calc-eyebrow`** — el eyebrow "Probálo" que vivía dentro del widget de calc cuando estaba en Pillar 2. Ya no se usa porque el eyebrow ahora vive a nivel sección como `.calc-section__eyebrow`. ~7 líneas para limpiar.
- **`.app-*`** (massive block) — CSS de los mockups inline que se construyeron antes de tener los screenshots reales. ~400 líneas. No rompen nada porque no hay markup que use esas clases.

### Código JS muerto

- **Motion script de pillar phones** — el código que anima `.pillar-phone-wrap` y `.pillar-phone-wrap .phone-mockup` busca elementos que ya no existen (pillar 1 perdió su mockup, pillar 2 fue reemplazado por la calculadora). El `forEach` itera sobre una colección vacía — no rompe, pero es código que ya no aporta. Decidir si remover o dejar pensando en un eventual retorno de los phone mockups en pillars.

### Archivos en `mockups/` que no se referencian

- `hero-hand.png` — versión anterior del hero (con mano visible). El hero ahora usa `Hero-section.png` (solo iPhone, gold-bezeled).
- `screen-proyeccion.png` — screenshot estático de la pantalla "Vos solo vs con Palm". Ya no se usa porque la calculadora hace la misma argumentación en vivo. Mantener por si se necesita rollback.
- `Hand mockup.png` y `Screenshot 2026-05-27 …` — son las copias originales antes del renombrado.

### Otros

- **🇦🇷 emojis residuales** — fueron removidos del hero badge y del cierre del CTA-final, pero **siguen** en el marquee ticker (`Hecho en Argentina 🇦🇷`) y en el footer copyright. El marquee tiene justificación contextual (decoración en ticker scrolleante); el footer es discutible — se puede limpiar.

---

## 7 · Próximos pasos posibles

### Refinamientos sugeridos por las skills (no aplicados)

- **Pillars asymmetric**: actualmente ambos pillars son typography-only y simétricos. Si se siente demasiado simétrico, agregar un screenshot pequeño solo a Pillar 1 (Gestión gratuita) para volver a la asimetría.
- **Footer flag emoji**: removerlo por consistencia con el resto del page.
- **Marquee dots**: técnicamente violan §9.F middle-dot rationing. Decidir si se mantienen (caso ticker) o se cambian por line-breaks (rompe el shape del marquee).
- **Limpiar `.calc-eyebrow` y `.app-*`** del CSS — orphans seguros de borrar.
- **Limpiar motion code de pillar phones** — código muerto post-promoción de la calculadora.

### Dependencias externas a considerar

- **Motion**: pinneada a `11.18.0`. Si quiere bumpear, cambiar la URL del CDN en el `<script type="module">`. Verificar que la nueva versión no cambie la API de `animate()` / `inView()`.
- **Three.js**: pinneada a `0.160.0`. Versiones recientes han hecho cambios breaking en el bundling — si se bumpea, testear que el shader sigue inicializando.
- **mathjs**: pinneada a `13.2.0`. La API `compile()` + `evaluate()` es estable desde v9, low risk.

### Migración eventual a stack moderno

Si en algún momento se necesita TypeScript, components reutilizables, o un build pipeline:

- **Mínimo viable**: Vite + vanilla TS. Mover el CSS inline a un `style.css` importado, los scripts a módulos TS separados. Mantener la lógica intacta. Aprox 3–4 horas de migración.
- **Si va para React/Next.js**: rewrite completo. Mejor hacerlo solo si hay razón de negocio (form server-side, auth, dashboard interno, etc.). Las skills `frontend-design` y `ui-ux-pro-max` instaladas asumen React/Tailwind como default — facilitarían el path.

### Skills de Claude Code instaladas (referencia)

Ya están en `~/.claude/skills/` y `~/.claude/plugins/cache/`:

- `hallmark` — anti-AI-slop design audit/redesign/study
- `design-taste-frontend` (registered como `taste-skill`) — diagnóstico de slop con dial system
- `ui-ux-pro-max` (v2.5.0) — design intelligence search con CSVs de patterns, palettes, fonts

Estas se pueden re-invocar en futuras sesiones para auditar cambios nuevos.

---

## 8 · Cómo retomar el trabajo

1. Levantar el server: `npx serve` en la raíz, abrir `http://localhost:3000`.
2. Para cualquier cambio: editar **`index.html` directamente**. Todo el CSS y JS vive ahí inline (~2300 líneas, navegable por comentarios de sección `═════════════════════════════════════════════`).
3. Antes de un cambio grande: leer la sección **4 (Decisiones de diseño)** de este archivo para no revertir trade-offs ya validados.
4. Para auditar diseño: invocar `Skill hallmark` con verb `audit`, o `Skill design-taste-frontend` para análisis general.
5. Las animaciones se controlan desde los tres `<script type="module">` al final del body. El shader, motion y mathjs son **independientes** — desactivar uno no rompe los otros.

---

*Última actualización del documento: ejecución actual de la sesión.*
