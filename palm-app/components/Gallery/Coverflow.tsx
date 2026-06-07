"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { GALLERY_CARDS } from "./galleryData";
import GalleryCard from "./GalleryCard";
import { slideTransform } from "./transforms";

export default function Coverflow() {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  const applyTransforms = useCallback((embla: NonNullable<CarouselApi>) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // static fallback: CSS handles layout, no transforms
    const snaps = embla.scrollSnapList();
    const progress = embla.scrollProgress();
    const engine = embla.internalEngine();
    const step = snaps.length > 1 ? Math.abs(snaps[1] - snaps[0]) : 1;

    snaps.forEach((snap, index) => {
      let diff = snap - progress;
      // Loop-aware wrap (Embla docs pattern) so edge cards transform correctly.
      engine.slideLooper.loopPoints.forEach((lp) => {
        const target = lp.target();
        if (index === lp.index && target !== 0) {
          if (Math.sign(target) === -1) diff = snap - (1 + progress);
          if (Math.sign(target) === 1) diff = snap + (1 - progress);
        }
      });
      const distance = step ? diff / step : diff; // in slide units
      const t = slideTransform(distance);
      const node = slideRefs.current[index];
      if (node) {
        gsap.set(node, {
          scale: t.scale,
          opacity: t.opacity,
          rotateY: t.rotateY,
          transformPerspective: 1000,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (!api) return;
    const onScroll = () => applyTransforms(api);
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onScroll();
    onSelect();
    api.on("scroll", onScroll);
    api.on("reInit", onScroll);
    api.on("select", onSelect);
    return () => {
      api.off("scroll", onScroll);
      api.off("reInit", onScroll);
      api.off("select", onSelect);
      gsap.set(slideRefs.current.filter(Boolean), { clearProps: "all" });
    };
  }, [api, applyTransforms]);

  return (
    <div className="coverflow">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "center" }}
        className="coverflow__carousel"
      >
        <CarouselContent className="coverflow__content">
          {GALLERY_CARDS.map((card, i) => (
            <CarouselItem key={card.id} className="coverflow__item">
              <div
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                className="coverflow__slide"
              >
                <GalleryCard card={card} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="coverflow__arrow" aria-label="Anterior" />
        <CarouselNext className="coverflow__arrow" aria-label="Siguiente" />
      </Carousel>

      <div className="coverflow__dots" role="tablist" aria-label="Ir a la tarjeta">
        {GALLERY_CARDS.map((card, i) => (
          <button
            key={card.id}
            type="button"
            className="coverflow__dot"
            aria-label={`Tarjeta ${i + 1}`}
            aria-current={selected === i}
            data-active={selected === i}
            onClick={() => api?.scrollTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
