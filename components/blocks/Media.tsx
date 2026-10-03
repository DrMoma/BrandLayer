"use client";

import { useEffect, useRef, useState } from "react";
import { getMedia } from "@/content/media";
import { LayerField } from "@/components/motion/LayerField";

/**
 * Renders whichever media kind the manifest declares. Components never know
 * or care whether a slot is procedural, a video or a still — which is what
 * makes swapping real footage in a one-line change.
 *
 * Video is gated on an IntersectionObserver: nothing decodes offscreen.
 * Every looping video gets a pause button (WCAG 2.2.2 — moving content must
 * be stoppable), and starts paused under reduced motion.
 */
export function Media({
  slot,
  className,
  priority = false,
  active = true,
}: {
  slot: string;
  className?: string;
  priority?: boolean;
  /** False for a hidden carousel slide — stops its field animating offscreen. */
  active?: boolean;
}) {
  const m = getMedia(slot);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // Set when the visitor pauses (or asks for reduced motion), so scrolling
  // back into view never restarts a video they stopped.
  const heldByUser = useRef(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Autoplay can start before hydration, so its play event is missed.
    setPlaying(!v.paused);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      heldByUser.current = true;
      v.pause();
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !heldByUser.current) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "100px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  if (m.kind === "procedural") {
    return (
      <div className={className ?? "h-full w-full"}>
        <LayerField seed={m.seed} density={m.density} speed={m.speed} paused={!active} />
      </div>
    );
  }

  if (m.kind === "video") {
    const toggle = () => {
      const v = videoRef.current;
      if (!v) return;
      if (v.paused) {
        heldByUser.current = false;
        v.play().catch(() => {});
      } else {
        heldByUser.current = true;
        v.pause();
      }
    };

    return (
      <div className="relative h-full w-full">
        <video
          ref={videoRef}
          className={className ?? "h-full w-full object-cover"}
          poster={m.poster}
          muted
          loop
          playsInline
          // A priority video is the hero: declare autoplay on the element so it
          // starts without waiting for JS, and preload enough to begin cleanly.
          // Muted is what makes autoplay permissible at all.
          autoPlay={priority}
          preload={priority ? "auto" : "none"}
          aria-label={m.alt}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          {m.portrait && <source src={m.portrait} media="(max-width: 768px)" type="video/mp4" />}
          <source src={m.landscape} type="video/mp4" />
        </video>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause video" : "Play video"}
          className="absolute bottom-3 right-3 z-10 grid size-9 place-items-center rounded-full bg-[var(--bg-default)]/85 text-[var(--text-default)] backdrop-blur transition-transform duration-200 hover:scale-105 tablet:bottom-4 tablet:right-4"
        >
          {playing ? (
            <svg viewBox="0 0 12 12" className="size-3" fill="currentColor" aria-hidden="true">
              <rect x="2" y="1.5" width="2.6" height="9" rx="0.6" />
              <rect x="7.4" y="1.5" width="2.6" height="9" rx="0.6" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" className="size-3" fill="currentColor" aria-hidden="true">
              <path d="M3 1.6v8.8a.6.6 0 0 0 .9.5l7-4.4a.6.6 0 0 0 0-1L3.9 1.1a.6.6 0 0 0-.9.5Z" />
            </svg>
          )}
        </button>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={m.src}
      alt={m.alt}
      width={m.width}
      height={m.height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className ?? "h-full w-full object-cover"}
    />
  );
}
