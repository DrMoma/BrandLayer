"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FitText } from "@/components/motion/FitText";
import { Reveal } from "@/components/motion/Reveal";
import { Media } from "@/components/blocks/Media";
import { Label } from "@/components/blocks/primitives";
import { useIntroDone } from "@/lib/intro";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

type Slide = { slot: string; caption: string; href: string };

const AUTO_MS = 6000;

/**
 * HERO
 *
 * A fit-to-width display lockup over a media carousel. The carousel is
 * landscape on desktop and switches to the full 9:16 portrait cut on phones,
 * deliberately taller than the screen so the first scroll travels through
 * the film rather than past it (at least 88% of the screen's height, so even
 * short phones get a stretch of it below the fold).
 *
 * Autoplay stops on hover, on focus, when the tab is hidden and under reduced
 * motion. Slides are a live region so the change is announced.
 */
export function Hero({ title, slides }: { title: string; slides: readonly Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // The video holds its reveal until the intro curtain is fully gone, so the
  // two entrances read as a sequence rather than overlapping.
  const introDone = useIntroDone();
  const timer = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tick = () => setIndex((i) => (i + 1) % slides.length);
    timer.current = window.setInterval(tick, AUTO_MS);

    const onVisibility = () => {
      if (document.hidden && timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      } else if (!document.hidden && !timer.current) {
        timer.current = window.setInterval(tick, AUTO_MS);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [paused, slides.length]);

  const current = slides[index];

  return (
    <section
      className="relative flex min-h-[100svh] flex-col justify-between pt-[var(--header-h)]"
      aria-label="Introduction"
    >
      {/* The lockup fills the content width exactly. */}
      <div className="canvas">
        <h1 className="sr-only">
          {site.name} — {site.tagline}
        </h1>
        <FitText text={title} delay={0} stagger={90} aria-hidden="true" />
      </div>

      {/* Carousel */}
      <div
        className="canvas mt-[var(--space-block)]"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <Reveal
          anim="curtain"
          delay={160}
          gate={introDone}
          className="relative w-full overflow-hidden bg-[var(--bg-raised)] aspect-[9/16] min-h-[88svh] tablet:aspect-[16/9] tablet:min-h-0"
        >
          {slides.map((slide, i) => (
            <div
              key={slide.slot}
              aria-hidden={i !== index}
              className={cn(
                "absolute inset-0 transition-opacity duration-[900ms] ease-[var(--ease-house)]",
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              )}
            >
              <Media
                slot={slide.slot}
                priority={i === 0}
                active={i === index}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </Reveal>

        {slides.length > 1 && (
          <p aria-live="polite" className="sr-only">
            Slide {index + 1} of {slides.length}. {current.caption}
          </p>
        )}

        {/* Caption + controls */}
        <div className="mt-4 flex items-start justify-between gap-6 pb-[calc(var(--space-block)+72px)]">
          <Reveal delay={420} className="min-w-0 flex-1">
            <Link href={current.href} className="group link-wipe type-caption text-[var(--text-default)]">
              {current.caption}
              <span className="arrow-nudge ml-[0.3em]" aria-hidden="true">
                ↘
              </span>
            </Link>
          </Reveal>

          {/* A single looping film has nothing to page through. */}
          {slides.length > 1 && (
            <Reveal delay={480} className="flex shrink-0 items-center gap-3">
              <Label className="tabular-nums">
                {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </Label>
              <div className="flex items-center gap-1">
                <CarouselButton label="Previous slide" onClick={() => go(index - 1)}>
                  ←
                </CarouselButton>
                <CarouselButton label="Next slide" onClick={() => go(index + 1)}>
                  →
                </CarouselButton>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

function CarouselButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-full border border-[var(--stroke-soft)] text-[var(--text-neutral)] transition-colors duration-300 hover:border-[var(--stroke-firm)] hover:text-[var(--text-default)]"
    >
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
