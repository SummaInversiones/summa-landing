"use client";

import { useEffect } from "react";

/**
 * Faithful port of index.html's global behaviors:
 *  - navbar pill compress past 200px scroll  (index.html 3411-3418)
 *  - IntersectionObserver scroll-reveal       (index.html 3443-3456)
 *  - 3D pillar tilt + sheen on [data-tilt]    (index.html 3496-3526)
 *  - [data-split-words] heading splitter +    (index.html 4253-4327)
 *    staggered word reveal — reimplemented with the Web Animations API
 *    instead of the CDN `motion` package (identical keyframes/stagger).
 *
 * Mounted once at the bottom of the page. Mirrors the original vanilla logic
 * 1:1, including reduced-motion handling.
 */
export function ClientEnhancements() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    /* ── Navbar pill compress ────────────────────────────────── */
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      const onScroll = () =>
        navbar.classList.toggle("scrolled", window.scrollY > 200);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
    }

    /* ── Scroll reveal ───────────────────────────────────────── */
    const reveals = Array.from(document.querySelectorAll(".reveal"));
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 },
      );
      reveals.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    } else {
      reveals.forEach((el) => el.classList.add("in"));
    }

    /* ── [data-split-words] heading splitter + word reveal ───── */
    const splitTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-split-words]:not(.split-ready)"),
    );

    // Walk the DOM replacing TEXT NODES with <span class="split-word"> per word,
    // cloning element wrappers (.kw, <em>) shallowly so their styles cascade,
    // preserving <br> and whitespace text nodes. (index.html splitIntoWords)
    const splitIntoWords = (el: HTMLElement) => {
      const frag = document.createDocumentFragment();
      const walk = (source: Node, target: Node) => {
        for (const child of Array.from(source.childNodes)) {
          if (child.nodeType === Node.TEXT_NODE) {
            const tokens = (child.textContent ?? "").split(/(\s+)/);
            for (const tok of tokens) {
              if (tok === "") continue;
              if (/^\s+$/.test(tok)) {
                target.appendChild(document.createTextNode(tok));
              } else {
                const span = document.createElement("span");
                span.className = "split-word";
                span.textContent = tok;
                target.appendChild(span);
              }
            }
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const elChild = child as Element;
            if (elChild.tagName.toLowerCase() === "br") {
              target.appendChild(elChild.cloneNode());
            } else {
              const clone = elChild.cloneNode(false);
              target.appendChild(clone);
              walk(elChild, clone);
            }
          }
        }
      };
      walk(el, frag);
      el.replaceChildren(frag);
    };

    if (reduced) {
      // Reduced motion: unhide without splitting (DOM untouched for AT).
      splitTargets.forEach((el) => el.classList.add("split-ready"));
    } else {
      splitTargets.forEach((el) => {
        splitIntoWords(el);
        el.classList.add("split-ready");
        const words = Array.from(el.querySelectorAll<HTMLElement>(".split-word"));
        const io = new IntersectionObserver(
          (entries) => {
            if (!entries[0].isIntersecting) return;
            io.disconnect(); // one-shot — never replays
            words.forEach((w, i) => {
              w.animate(
                [
                  { opacity: 0, transform: "translateY(24px)" },
                  { opacity: 1, transform: "translateY(0)" },
                ],
                {
                  duration: 450,
                  delay: i * 70,
                  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                  fill: "forwards",
                },
              );
            });
          },
          { rootMargin: "-50px 0px" },
        );
        io.observe(el);
        cleanups.push(() => io.disconnect());
      });
    }

    /* ── 3D tilt + sheen on [data-tilt] ──────────────────────── */
    if (!reduced) {
      const max = 6;
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        let raf = 0;
        let pending: { x: number; y: number } | null = null;
        const apply = () => {
          raf = 0;
          if (!pending) return;
          const { x, y } = pending;
          el.style.transform = `rotateX(${-y * max}deg) rotateY(${x * max}deg)`;
          el.style.setProperty("--sheen-angle", `${90 + x * 60}deg`);
        };
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          pending = {
            x: (e.clientX - r.left) / r.width - 0.5,
            y: (e.clientY - r.top) / r.height - 0.5,
          };
          if (!raf) raf = requestAnimationFrame(apply);
          el.classList.add("is-tilting");
        };
        const onLeave = () => {
          el.classList.remove("is-tilting");
          el.style.transform = "";
          pending = null;
        };
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("mousemove", onMove);
          el.removeEventListener("mouseleave", onLeave);
        });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
