"use client";

import { useEffect } from "react";
import { animate, inView } from "motion";

/**
 * Faithful 1:1 port of index.html's motion@11 `<script type="module">` block
 * (index.html lines 3530-4066). The only change from the original is swapping
 * the CDN dynamic import for the npm `motion` package import above, plus React
 * cleanup so StrictMode's double-invoke (and unmount) doesn't stack animations.
 *
 * Reproduces: startIdle float/wobble, pillar-phone entrance/idle/hover-tilt
 * (selectors match nothing in this app — kept harmless), hero-hand float,
 * the .pcard entrance + per-card animations (goals ball arc, zero pill
 * drift+dissolve, portfolio donut draw+rebalance, cc scanner sweep + lupa),
 * and the catch fallback.
 */
export default function CardAnimations() {
  useEffect(() => {
    let cancelled = false;
    const teardown: Array<() => void> = [];

    try {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Each wrapper gets its own desync so the row doesn't bob in lockstep
      const startIdle = (el: HTMLElement, i: number) => {
        // gentle vertical float, ~5–7s, staggered phase
        const a1 = animate(
          el,
          { y: [0, -8, 0] },
          {
            duration: 5.2 + (i % 4) * 0.55,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (i % 4) * 0.42,
          }
        );
        teardown.push(() => a1.stop());
        // very slow Y-axis "breathing" wobble (±1.4°)
        const a2 = animate(
          el,
          { rotateY: [0, 1.4, 0, -1.4, 0] },
          {
            duration: 9.5 + (i % 3) * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (i % 3) * 0.6,
          }
        );
        teardown.push(() => a2.stop());
      };

      // ── Entrance + idle on each PILLAR phone wrapper only ────────────────────
      //    (Step screenshots now ride the standard .reveal CSS — no motion idle.)
      const grids = document.querySelectorAll(".pillars-grid");
      grids.forEach((grid) => {
        const wraps = grid.querySelectorAll<HTMLElement>(".pillar-phone-wrap");
        wraps.forEach((w, i) => {
          if (reduceMotion) {
            w.style.opacity = "1";
            w.style.transform = "none";
            return;
          }
          const stop = inView(
            w,
            () => {
              stop();
              const run = async () => {
                await animate(
                  w,
                  {
                    opacity: [0, 1],
                    y: [28, 0],
                    scale: [0.92, 1],
                    rotateX: [-18, 0],
                  },
                  { duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
                );
                startIdle(w, i);
              };
              run();
            },
            { margin: "-60px 0px" }
          );
          teardown.push(stop);
        });
      });

      // ── Hover tilt — pillar phones only ──────────────────────────────────────
      const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (canHover && !reduceMotion) {
        const tiltTargets = document.querySelectorAll<HTMLElement>(
          ".pillar-phone-wrap .phone-mockup"
        );
        tiltTargets.forEach((phone) => {
          const max = 10; // degrees
          let hovering = false;

          phone.addEventListener("mouseenter", () => {
            hovering = true;
          });

          phone.addEventListener("mousemove", (e: MouseEvent) => {
            const r = phone.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
            const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
            animate(
              phone,
              {
                rotateX: -dy * max,
                rotateY: dx * max,
                scale: 1.04,
              },
              { duration: 0.35, ease: "easeOut" }
            );
          });

          phone.addEventListener("mouseleave", () => {
            hovering = false;
            animate(
              phone,
              { rotateX: 0, rotateY: 0, scale: 1 },
              { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
            );
          });
        });
      }

      // ── Hero hand-mockup: replace CSS keyframe float with motion-driven float ─
      // (smoother and pause-safe; the CSS animation is left as a fallback)
      const heroHand = document.querySelector<HTMLElement>(".hero-handshot");
      if (heroHand && !reduceMotion) {
        heroHand.style.animation = "none"; // disable CSS keyframe
        const hh = animate(
          heroHand,
          { y: [0, -10, 0], rotate: [0, 0.6, 0, -0.6, 0] },
          { duration: 6, repeat: Infinity, ease: "easeInOut" }
        );
        teardown.push(() => hh.stop());
      }

      // ── Explore cards — entrance (with stagger via --i) + per-card idle ──────
      const pcards = document.querySelectorAll<HTMLElement>(".pcard");
      pcards.forEach((card, idx) => {
        const i = Number(card.style.getPropertyValue("--i") || idx);

        // Pre-flight: knock Card 3's donut back to its hidden initial state
        // BEFORE the inView fires, so users below the fold don't briefly see
        // the final state on page load. ReduceMotion users skip this block,
        // so the HTML default (visible donut + "100%") shows for them.
        if (!reduceMotion && card.classList.contains("pcard--portfolio")) {
          const scene = card.querySelector(".g3-scene");
          if (scene) {
            scene.querySelectorAll(".g3-arc").forEach((arc: Element) => {
              const dash = parseFloat(
                (arc.getAttribute("stroke-dasharray") || "0").split(/\s+/)[0]
              );
              arc.setAttribute("stroke-dashoffset", String(dash));
            });
            const txt = scene.querySelector(".g3-balance");
            if (txt) txt.textContent = "0%";
          }
        }

        if (reduceMotion) {
          card.style.opacity = "1";
          card.style.transform = "none";
          // Card 4: the 0% defaults to hidden in CSS; force it visible
          // as a static fallback. Pills stay hidden — the 0% alone tells
          // the story without needing the dissolving choreography.
          if (card.classList.contains("pcard--zero")) {
            const zero = card.querySelector<HTMLElement>(".g4-zero");
            if (zero) {
              zero.style.opacity = "1";
              zero.style.transform = "scale(1)";
            }
          }
          return;
        }

        const stop = inView(
          card,
          () => {
            stop();

            const run = async () => {
              // Entrance — fade + lift, staggered ~0.1s between cards
              await animate(
                card,
                { opacity: [0, 1], y: [24, 0] },
                { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
              );

              // Idle: blobs drift very slowly (translation only — rotate would
              // override the per-blob static --rot tilt set in CSS).
              card.querySelectorAll<HTMLElement>(".pcard__blob").forEach((blob, bi) => {
                const ba = animate(
                  blob,
                  {
                    x: [0, bi % 2 ? -10 : 12, 0],
                    y: [0, bi % 2 ? 8 : -10, 0],
                  },
                  { duration: 22 + bi * 3.5, repeat: Infinity, ease: "easeInOut" }
                );
                teardown.push(() => ba.stop());
              });

              // ── Card 2 ("goals") — ball jumps from small goal → large goal, in a loop ──
              // Card art is a static PNG background. Only the ball + dot trail move.
              // Positions are in % of card so they stay aligned with the image at any size.
              if (card.classList.contains("pcard--goals")) {
                const ball = card.querySelector<HTMLElement>(".g2-ball");
                if (!ball) return;
                const trailDots = card.querySelectorAll<HTMLElement>(".g2-trail-dot");

                // === TUNE THESE === position the ball directly over each diamond in the image.
                // Numbers are % of card (x from left, y from top).
                const SMALL_GOAL = { x: 36, y: 55 }; // perched on top of small diamond
                const LARGE_GOAL = { x: 78, y: 37 }; // perched on top of large diamond

                // Parabolic arc — X linear, Y parabolic with `peak` (in % of card height)
                // above the chord. Physics lives in this curve, not in an ease — that's
                // why `ease: 'linear'` is correct on the driver.
                const arcPos = (
                  t: number,
                  x1: number,
                  y1: number,
                  x2: number,
                  y2: number,
                  peak: number
                ) => ({
                  x: x1 + (x2 - x1) * t,
                  y: (1 - t) * y1 + t * y2 - 4 * peak * t * (1 - t),
                });

                const setBall = (x: number, y: number) => {
                  ball.style.left = x.toFixed(2) + "%";
                  ball.style.top = y.toFixed(2) + "%";
                };

                const jump = (
                  from: { x: number; y: number },
                  to: { x: number; y: number },
                  duration: number,
                  peak: number
                ) => {
                  const N = trailDots.length;
                  // Pre-place trail dots at fixed t along this arc. They stay put;
                  // JS only fades their opacity as the ball passes each one.
                  trailDots.forEach((dot, i) => {
                    const dotT = (i + 1) / (N + 1);
                    const p = arcPos(dotT, from.x, from.y, to.x, to.y, peak);
                    dot.style.left = p.x.toFixed(2) + "%";
                    dot.style.top = p.y.toFixed(2) + "%";
                    dot.style.opacity = "0";
                  });

                  return animate(0, 1, {
                    duration,
                    ease: "linear",
                    onUpdate: (t: number) => {
                      const p = arcPos(t, from.x, from.y, to.x, to.y, peak);
                      setBall(p.x, p.y);
                      trailDots.forEach((dot, i) => {
                        const dotT = (i + 1) / (N + 1);
                        if (t >= dotT) {
                          const age = t - dotT;
                          dot.style.opacity = Math.max(0, 0.85 - age * 1.6).toFixed(3);
                        }
                      });
                    },
                  }).finished;
                };

                const sleep = (s: number) => new Promise((r) => setTimeout(r, s * 1000));

                const fadeBall = (from: number, to: number, duration: number) =>
                  animate(from, to, {
                    duration,
                    ease: "easeOut",
                    onUpdate: (v: number) => {
                      ball.style.opacity = v.toFixed(3);
                    },
                  }).finished;

                const clearTrail = () =>
                  trailDots.forEach((d) => {
                    d.style.opacity = "0";
                  });

                // Initial position — ball perched on the small goal
                setBall(SMALL_GOAL.x, SMALL_GOAL.y);

                if (reduceMotion) return;

                const stopGoals = inView(
                  card,
                  () => {
                    stopGoals();
                    const goalsRun = async () => {
                      try {
                        while (!cancelled) {
                          await sleep(0.45); // pause at small goal
                          await jump(SMALL_GOAL, LARGE_GOAL, 1.6, 14); // arc to large goal
                          await sleep(0.75); // pause at large goal
                          await fadeBall(1, 0, 0.35); // fade out
                          clearTrail();
                          setBall(SMALL_GOAL.x, SMALL_GOAL.y); // teleport back invisible
                          await fadeBall(0, 1, 0.5); // fade in at small goal
                        }
                      } catch (e) {
                        // animate() rejects when controls are stopped — silent.
                      }
                    };
                    goalsRun();
                  },
                  { margin: "-80px 0px" }
                );
                teardown.push(stopGoals);
              }

              // ── Card 4 ("zero") — continuous pill drift + dissolve flow ──────
              // The 0% pops in once and stays put. Each of the 3 pills runs an
              // independent infinite loop: spawn at a random edge → bezier drift
              // toward near-centre with sutile bob → dissolve (fade + scale + blur)
              // in the last 40% of the trajectory, finishing BEFORE touching the 0%.
              // Staggered initial delays + randomised durations keep the cycles
              // permanently desynced so the card is never empty and never in sync.
              if (card.classList.contains("pcard--zero")) {
                const zero = card.querySelector<HTMLElement>(".g4-zero");
                const pillWraps = card.querySelectorAll<HTMLElement>(".g4-pill-wrap");
                if (zero && pillWraps.length) {
                  const sleep = (s: number) => new Promise((r) => setTimeout(r, s * 1000));

                  // 1. Pop the 0% in once, then it stays absolutely still
                  await animate(
                    zero,
                    { opacity: [0, 1], scale: [0.7, 1] },
                    { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
                  ).finished;

                  // ── helpers ────────────────────────────────────────────────────
                  // Pick a random point just OUTSIDE the stage, on one of the 4 edges.
                  // Pills start invisible (opacity 0) at this point and drift inward.
                  const pickEdge = () => {
                    const side = Math.floor(Math.random() * 4);
                    const along = 18 + Math.random() * 64; // 18..82% along the edge
                    switch (side) {
                      case 0:
                        return { x: along, y: -12 }; // top
                      case 1:
                        return { x: 112, y: along }; // right
                      case 2:
                        return { x: along, y: 112 }; // bottom
                      default:
                        return { x: -12, y: along }; // left
                    }
                  };
                  // End near (but not on) the 0% centre, jittered so cycles never repeat.
                  const pickEnd = () => ({
                    x: 48 + Math.random() * 4,
                    y: 48 + Math.random() * 4,
                  });
                  // Control point: midpoint, then offset perpendicular to the chord
                  // by ±15 (% of stage). That's what bends the trajectory into a curve.
                  const pickControl = (
                    start: { x: number; y: number },
                    end: { x: number; y: number }
                  ) => {
                    const midX = (start.x + end.x) / 2;
                    const midY = (start.y + end.y) / 2;
                    const dx = end.x - start.x;
                    const dy = end.y - start.y;
                    const len = Math.hypot(dx, dy) || 1;
                    const perpX = -dy / len;
                    const perpY = dx / len;
                    const offset = (Math.random() - 0.5) * 30; // -15..+15
                    return { x: midX + perpX * offset, y: midY + perpY * offset };
                  };

                  // One drift+dissolve cycle for a single pill.
                  // Drives EVERYTHING off a single t ∈ [0,1] so position, opacity,
                  // scale and blur are always perfectly synced.
                  const cycle = async (wrap: HTMLElement, bob: HTMLElement, pill: HTMLElement) => {
                    const start = pickEdge();
                    const end = pickEnd();
                    const control = pickControl(start, end);
                    const duration = 3 + Math.random() * 1.5; // 3.0..4.5 s

                    // Bob: independent infinite Y oscillation on the middle layer.
                    // Slightly different period per cycle so neighbouring pills don't
                    // visually beat in sync.
                    const bobAnim = animate(
                      bob,
                      { y: [0, -3, 2, 0] },
                      { duration: 1.5 + Math.random() * 0.7, repeat: Infinity, ease: "easeInOut" }
                    );

                    try {
                      await animate(0, 1, {
                        duration,
                        ease: "linear",
                        onUpdate: (t: number) => {
                          // Quadratic bezier position
                          const it = 1 - t;
                          const x = it * it * start.x + 2 * it * t * control.x + t * t * end.x;
                          const y = it * it * start.y + 2 * it * t * control.y + t * t * end.y;
                          wrap.style.left = x.toFixed(2) + "%";
                          wrap.style.top = y.toFixed(2) + "%";

                          // Opacity ramp: fade in 0–15 %, full 15–60 %, dissolve 60–100 %
                          let op;
                          if (t < 0.15) op = t / 0.15;
                          else if (t < 0.6) op = 1;
                          else op = (1 - t) / 0.4;
                          pill.style.opacity = op.toFixed(3);

                          // Dissolve: scale + filter blur, both active only in the
                          // last 40 % (dt 0→1) so the pill comes apart on approach.
                          const dt = Math.max(0, (t - 0.6) / 0.4);
                          const scale = 1 - dt * 0.18; // 1 → 0.82
                          const blur = dt * 5; // 0 → 5 px
                          pill.style.transform = `scale(${scale.toFixed(3)})`;
                          pill.style.filter = `blur(${blur.toFixed(2)}px)`;
                        },
                      }).finished;
                    } finally {
                      bobAnim.stop?.();
                      bob.style.transform = ""; // clean slate for next cycle
                    }
                  };

                  // Infinite per-pill loop. Each pill is its own independent timer —
                  // their durations and pauses are randomised, so they desync forever.
                  const pillLoop = async (wrap: HTMLElement, initialDelay: number) => {
                    const bob = wrap.querySelector<HTMLElement>(".g4-pill-bob");
                    const pill = wrap.querySelector<HTMLElement>(".g4-pill");
                    await sleep(initialDelay);
                    try {
                      while (!cancelled) {
                        await cycle(wrap, bob as HTMLElement, pill as HTMLElement);
                        await sleep(Math.random() * 0.4); // 0..0.4 s micro-pause
                      }
                    } catch (e) {
                      /* aborted — silent */
                    }
                  };

                  // Fire the 3 loops with staggered starts so the card is populated
                  // from the get-go but the cycles never coincide.
                  pillWraps.forEach((wrap, idx) => {
                    pillLoop(wrap, idx * 1.4); // 0 s, 1.4 s, 2.8 s
                  });
                }
              }

              // ── Card 3 ("portfolio") — donut: sequential arc draw + count-up + idle rotation ──
              if (card.classList.contains("pcard--portfolio")) {
                const scene = card.querySelector(".g3-scene");
                if (scene) {
                  const arcs = scene.querySelectorAll<SVGElement>(".g3-arc");
                  const balanceTxt = scene.querySelector(".g3-balance") as Element;
                  const donutRot = scene.querySelector(".g3-donut-rot");

                  // Sequential draw: each segment animates stroke-dashoffset L → 0
                  // with a 0.18s stagger. Each arc's L is the first number in its
                  // stroke-dasharray (which equals its segment percentage).
                  const arcPromises = Array.from(arcs).map((arc, idx) => {
                    return animate(
                      arc,
                      { strokeDashoffset: 0 },
                      {
                        duration: 0.6,
                        delay: idx * 0.18,
                        ease: [0.16, 1, 0.3, 1],
                      }
                    ).finished;
                  });

                  const totalDuration = (arcs.length - 1) * 0.18 + 0.6;

                  // Count-up runs alongside, ending at the same time
                  const countPromise = animate(0, 100, {
                    duration: totalDuration,
                    ease: "easeOut",
                    onUpdate: (v: number) => {
                      balanceTxt.textContent = Math.round(v) + "%";
                    },
                  }).finished;

                  // Wait for the entrance to settle, then start the rebalance loop.
                  try {
                    await Promise.all([...arcPromises, countPromise]);
                  } catch (e) {
                    return;
                  }

                  // ── Rebalance loop ─────────────────────────────────────────
                  // 4 portfolio "profiles". Each defines the 4 segment %s + the
                  // centre number. Loop cycles through them, smoothly interpolating
                  // segments AND number via a single onUpdate driver per transition.
                  const PROFILES = [
                    { segments: [40, 25, 20, 15], value: 100 }, // A — balanced (post-entrance state)
                    { segments: [55, 20, 15, 10], value: 88 }, // B — concentrated in segment 1 (lila dominant)
                    { segments: [30, 30, 25, 15], value: 94 }, // C — lila & gold near-parity
                    { segments: [20, 20, 30, 30], value: 76 }, // D — weight shifted to cream / white
                  ];

                  // Smoothly transition the donut from `from` profile to `to` profile.
                  // ALL state — 4 segments + 4 start angles + centre number — is derived
                  // from the same `t` in a single onUpdate so they can't desync.
                  const transitionTo = (
                    from: { segments: number[]; value: number },
                    to: { segments: number[]; value: number },
                    duration: number
                  ) =>
                    animate(0, 1, {
                      duration,
                      ease: "easeInOut",
                      onUpdate: (t: number) => {
                        // Interpolate each segment length and accumulate the start angle.
                        // The angle of segment i is `-90° + (sum of previous segments) × 3.6°`,
                        // so as soon as segment 1 changes, segments 2/3/4 reposition automatically
                        // — no separate "angle animation" needed.
                        let cumStart = 0;
                        for (let i = 0; i < arcs.length; i++) {
                          const len = from.segments[i] + (to.segments[i] - from.segments[i]) * t;
                          const gap = 100 - len;
                          arcs[i].setAttribute("stroke-dasharray", `${len.toFixed(3)} ${gap.toFixed(3)}`);
                          arcs[i].setAttribute(
                            "transform",
                            `rotate(${(-90 + cumStart * 3.6).toFixed(3)})`
                          );
                          cumStart += len;
                        }
                        // Number interpolates on the SAME t — paints in the same frame
                        // as the arcs, so the change is perfectly in sync.
                        const num = from.value + (to.value - from.value) * t;
                        balanceTxt.textContent = Math.round(num) + "%";
                      },
                    }).finished;

                  const sleep = (s: number) => new Promise((r) => setTimeout(r, s * 1000));
                  const HOLD_SEC = 1.7;
                  const TRANSITION_SEC = 0.7;

                  let currentIdx = 0; // post-entrance state == PROFILES[0]
                  try {
                    while (!cancelled) {
                      await sleep(HOLD_SEC);
                      const nextIdx = (currentIdx + 1) % PROFILES.length;
                      await transitionTo(PROFILES[currentIdx], PROFILES[nextIdx], TRANSITION_SEC);
                      currentIdx = nextIdx;
                    }
                  } catch (e) {
                    /* animate stopped — silent */
                  }
                }
              }

              // ── Card "statement" — live expense list: amounts keep changing ──
              // Each row's amount jitters around its data-base value on its own
              // desynced loop, so the card reads like a tracker updating live.
              if (card.classList.contains("pcard--statement")) {
                const amts = card.querySelectorAll<HTMLElement>(".gastos-amt");
                const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-AR");
                const sleep = (s: number) => new Promise((r) => setTimeout(r, s * 1000));
                amts.forEach((el, ai) => {
                  const base = Number(el.getAttribute("data-base")) || 0;
                  let current = base;
                  el.textContent = fmt(current);
                  const loop = async () => {
                    try {
                      while (!cancelled) {
                        await sleep(1.4 + ai * 0.4 + Math.random() * 0.8);
                        const target = base * (0.88 + Math.random() * 0.24); // ±12%
                        await animate(current, target, {
                          duration: 0.8,
                          ease: [0.16, 1, 0.3, 1],
                          onUpdate: (v: number) => {
                            current = v;
                            el.textContent = fmt(v);
                          },
                        }).finished;
                      }
                    } catch (e) {
                      /* stopped — silent */
                    }
                  };
                  loop();
                });
              }

              // ── Card 1 ("cc") — lupa scan loop ─────────────────────────────────
              if (card.classList.contains("pcard--cc")) {
                const frame = card.querySelector<HTMLElement>(".cc-frame");
                const canvas = card.querySelector<HTMLElement>(".cc-canvas");
                if (!frame || !canvas) return;

                // Frame entrance (subtle — comes in after the card lifts in)
                animate(
                  frame,
                  { opacity: [0, 1], y: [10, 0] },
                  { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
                );

                // Lupa entrance — slides in from bottom-right onto resting position
                const lupa = canvas.querySelector<HTMLElement>(".cc-lupa");
                if (lupa) {
                  animate(
                    lupa,
                    { opacity: [0, 1], x: [28, 0], y: [28, 0] },
                    { duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }
                  );
                }

                // Scan loop — animate CSS vars on the CANVAS (single coordinate space).
                // The mask, the inverse mask, and the lupa's left/top all read these,
                // so they stay perfectly synced no matter how wide the path.
                //
                // Path: asymmetric figure-8 covering most of the cream's width and a
                // moderate vertical band. The canvas is wider than tall (cream is 5/4
                // and the coins row takes the top third), so the X amplitude is large
                // (~50% of canvas width) and the Y amplitude is moderate (~16%) — the
                // lens nearly fills the canvas vertically and would clip past edges
                // if Y swept further.
                //
                // Start == end so the loop seam is invisible. Duration bumped to keep
                // the pace slow despite the longer trajectory.
                const scanAnim = animate(
                  canvas,
                  {
                    "--scan-x": ["60%", "26%", "60%", "76%", "60%"],
                    "--scan-y": ["52%", "42%", "58%", "46%", "52%"],
                  } as any,
                  {
                    duration: 11,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.9, // wait until entrance finishes
                  }
                );
                teardown.push(() => scanAnim.stop());

                // Subtle "breathing" on the lupa — very small
                if (lupa) {
                  const breath = animate(
                    lupa,
                    { scale: [1, 1.018, 1] },
                    { duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.1 }
                  );
                  teardown.push(() => breath.stop());
                }
              }
            };

            run();
          },
          { margin: "-80px 0px" }
        );
        teardown.push(stop);
      });
    } catch (err) {
      // Fallback: reveal pillar phone wrappers AND explore cards if motion fails
      document.querySelectorAll<HTMLElement>(".pillar-phone-wrap, .pcard").forEach((w) => {
        w.style.opacity = "1";
        w.style.transform = "none";
      });
      console.warn("Motion failed to initialise, falling back to static elements:", err);
    }

    return () => {
      cancelled = true;
      teardown.forEach((fn) => {
        try {
          fn();
        } catch {}
      });
    };
  }, []);

  return null;
}
