"use client";

import { useEffect, useRef } from "react";

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  #define TWO_PI 6.2831853072
  #define PI 3.14159265359
  precision highp float;
  uniform vec2 resolution;
  uniform float time;
  void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    float t = time * 0.05;
    float lineWidth = 0.002;
    vec3 color = vec3(0.0);
    for (int j = 0; j < 3; j++) {
      for (int i = 0; i < 5; i++) {
        color[j] += lineWidth * float(i*i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
      }
    }
    gl_FragColor = vec4(color[0], color[1], color[2], 1.0);
  }
`;

export default function HeroShader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsWebGL = (() => {
      try {
        const c = document.createElement("canvas");
        return (
          !!(window.WebGL2RenderingContext && c.getContext("webgl2")) ||
          !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")))
        );
      } catch {
        return false;
      }
    })();
    if (prefersReducedMotion || !supportsWebGL) return; // brand-gradient CSS fallback stays

    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      try {
        const THREE = await import("three");
        if (cancelled) return;

        const camera = new THREE.Camera();
        camera.position.z = 1;
        const scene = new THREE.Scene();
        const geometry = new THREE.PlaneGeometry(2, 2);
        const uniforms = {
          time: { value: 1.0 },
          resolution: { value: new THREE.Vector2() },
        };
        const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
        scene.add(new THREE.Mesh(geometry, material));

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        container.appendChild(renderer.domElement);
        container.style.background = "transparent";

        const resize = () => {
          const w = container.clientWidth;
          const h = container.clientHeight;
          renderer.setSize(w, h, false);
          uniforms.resolution.value.x = renderer.domElement.width;
          uniforms.resolution.value.y = renderer.domElement.height;
        };
        resize();
        window.addEventListener("resize", resize, { passive: true });

        // Pause when the hero scrolls offscreen (battery / GPU saver)
        let running = true;
        const hero = container.closest(".hero");
        let io: IntersectionObserver | undefined;
        if (hero && "IntersectionObserver" in window) {
          io = new IntersectionObserver(
            (entries) => {
              running = entries[0].isIntersecting;
            },
            { threshold: 0 },
          );
          io.observe(hero);
        }

        let last = performance.now();
        let raf = 0;
        const tick = (now: number) => {
          raf = requestAnimationFrame(tick);
          if (!running) {
            last = now;
            return;
          }
          const dt = (now - last) / 1000;
          last = now;
          uniforms.time.value += dt * 3.0; // ~equivalent to +0.05 per frame at 60fps
          renderer.render(scene, camera);
        };
        raf = requestAnimationFrame(tick);

        cleanup = () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("resize", resize);
          io?.disconnect();
          renderer.domElement.remove();
          renderer.dispose();
          geometry.dispose();
          material.dispose();
        };
      } catch (err) {
        // Brand gradient fallback remains on #shader-bg via CSS
        console.warn("Shader background failed to initialise:", err);
      }
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return <div id="shader-bg" ref={containerRef} aria-hidden />;
}
