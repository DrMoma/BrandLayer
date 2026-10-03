"use client";

import { useEffect, useRef } from "react";

/**
 * One IntersectionObserver for the entire page.
 *
 * Every reveal on the site is CSS; JS only flips data-inview="true" and then
 * unobserves. The whole scroll system is a single observer and one attribute
 * write per element, for good.
 *
 * The observer is GATED so the intro can hold it closed. Without the gate,
 * everything above the fold would reveal at t=0 behind the intro curtain and
 * be finished by the time the curtain lifted — the viewer would never see it.
 */
let observer: IntersectionObserver | null = null;
let released = false;
const pending = new Set<HTMLElement>();

function create() {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.inview = "true";
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.01 }
  );
  return observer;
}

/** Opens the gate. Called by the intro on completion, or immediately if none. */
export function releaseInView() {
  if (released) return;
  released = true;
  const io = observer ?? create();
  for (const el of pending) io.observe(el);
  pending.clear();
}

export function observe(el: HTMLElement | null) {
  if (!el) return;
  if (!released) {
    pending.add(el);
    return;
  }
  (observer ?? create()).observe(el);
}

export function unobserve(el: HTMLElement | null) {
  if (!el) return;
  pending.delete(el);
  observer?.unobserve(el);
}

export function useInView<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    observe(el);
    return () => unobserve(el);
  }, [enabled]);
  return ref;
}
