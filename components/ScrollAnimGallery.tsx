"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CARDS = [
  { chip: "01", h: "Gastos claros", p: "Tu resumen bancario, ordenado por categoría." },
  { chip: "02", h: "Objetivos", p: "Un plan concreto para cada meta tuya." },
  { chip: "03", h: "Portafolio", p: "Una cartera armada a tu medida." },
];

const PARALLAX_SPEED = [1.6, 0.6, 1.1]; // differential depth per card

type Demo = { key: string; num: string; name: string; desc: string; reveal: boolean };

const DEMOS: Demo[] = [
  { key: "fade", num: "01", name: "Aparición", desc: "Sube y aparece con un leve desfase entre tarjetas (stagger).", reveal: true },
  { key: "scale", num: "02", name: "Escala", desc: "Crece desde el 80% con un pequeño rebote.", reveal: true },
  { key: "slide", num: "03", name: "Deslizamiento", desc: "Entra desde los costados, alternando izquierda y derecha.", reveal: true },
  { key: "blur", num: "04", name: "Enfoque", desc: "Pasa de desenfocada a nítida mientras sube.", reveal: true },
  { key: "flip", num: "05", name: "Giro 3D", desc: "Rota sobre su base como si se parara desde el piso.", reveal: true },
  { key: "parallax", num: "06", name: "Parallax", desc: "Las tarjetas se mueven a distinta velocidad según el scroll (profundidad).", reveal: false },
];

export default function ScrollAnimGallery() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const scope = root.current;
    scope.classList.add("sa-ready"); // CSS hides reveal cards only once JS is live
    const q = gsap.utils.selector(scope);

    const mm = gsap.matchMedia(scope);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 01 — Fade up (batched stagger)
      ScrollTrigger.batch(q(".sa-demo--fade .sa-card"), {
        start: "top 85%",
        onEnter: (b) => gsap.fromTo(b, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.12, overwrite: true }),
        onLeaveBack: (b) => gsap.to(b, { y: 50, opacity: 0, duration: 0.4, overwrite: true }),
      });

      // 02 — Scale in
      ScrollTrigger.batch(q(".sa-demo--scale .sa-card"), {
        start: "top 85%",
        onEnter: (b) => gsap.fromTo(b, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.5)", stagger: 0.1, overwrite: true }),
        onLeaveBack: (b) => gsap.to(b, { scale: 0.8, opacity: 0, duration: 0.4, overwrite: true }),
      });

      // 03 — Slide from alternating sides
      q(".sa-demo--slide .sa-card").forEach((card, i) => {
        gsap.fromTo(card, { x: i % 2 ? 80 : -80, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 86%", toggleActions: "play none none reverse" },
        });
      });

      // 04 — Blur → sharp
      q(".sa-demo--blur .sa-card").forEach((card) => {
        gsap.fromTo(card, { filter: "blur(14px)", opacity: 0, y: 22 }, {
          filter: "blur(0px)", opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 86%", toggleActions: "play none none reverse" },
        });
      });

      // 05 — 3D flip from its base
      q(".sa-demo--flip .sa-card").forEach((card) => {
        gsap.fromTo(card, { rotationX: -72, opacity: 0, transformPerspective: 900, transformOrigin: "center bottom" }, {
          rotationX: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 84%", toggleActions: "play none none reverse" },
        });
      });

      // 06 — Parallax depth (scrub)
      const parallaxSection = q(".sa-demo--parallax")[0];
      q(".sa-demo--parallax .sa-card").forEach((card) => {
        const speed = parseFloat((card as HTMLElement).dataset.speed || "1");
        gsap.fromTo(card, { yPercent: speed * 12 }, {
          yPercent: -speed * 12, ease: "none",
          scrollTrigger: { trigger: parallaxSection, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      ScrollTrigger.refresh();
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="sa-page" ref={root}>
      <header className="sa-topbar">
        <a href="/" className="sa-home" aria-label="Palm — inicio">
          <img src="/mockups/palm-logo.png" alt="Palm" />
          <span>Palm</span>
        </a>
        <a href="/" className="sa-back">← Volver al inicio</a>
      </header>

      <div className="sa-hero">
        <h1>Animaciones de <span className="kw">scroll</span></h1>
        <p>Galería de tratamientos que podemos aplicar a las tarjetas al hacer scroll. Scrolleá para verlos — funcionan en laptop y celular.</p>
        <span className="sa-hint">Scrolleá para verlas</span>
      </div>

      {DEMOS.map((d) => (
        <section
          key={d.key}
          className={`sa-demo sa-demo--${d.key}`}
          {...(d.reveal ? { "data-reveal": "" } : {})}
        >
          <div className="sa-demo__label">
            <span className="sa-demo__num">{d.num}</span>
            <span className="sa-demo__name">{d.name}</span>
            <p className="sa-demo__desc">{d.desc}</p>
          </div>
          <div className="sa-grid">
            {CARDS.map((c, i) => (
              <article
                key={i}
                className="sa-card"
                data-speed={d.key === "parallax" ? PARALLAX_SPEED[i] : undefined}
              >
                <span className="sa-card__chip">{c.chip}</span>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
