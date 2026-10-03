"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor — desktop, fine-pointer, motion-allowed only.
 *
 * A 1px ring that trails the pointer and swells to 56px over media, where it
 * picks up the accent and names the action. Everything else on the site is
 * restrained, so this is where a little personality is affordable.
 *
 * The native cursor is only hidden once this is actually mounted and running,
 * so a touch device or a reduced-motion user is never left without one.
 *
 * The ring lives on <body>, outside every tone section, so it can't inherit
 * their tokens. Instead it reads the background under the pointer and turns
 * white over dark ground — the footer, ink buttons, a picked date.
 */

/** Parses a computed background colour to [r, g, b, a] on a 0–255 scale. */
function parseColor(value: string): [number, number, number, number] | null {
  const rgb = value.match(/^rgba?\(([^)]+)\)$/);
  if (rgb) {
    const [r, g, b, a = 1] = rgb[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return [r, g, b, a];
  }
  // color-mix() and alpha modifiers compute to color(srgb r g b / a), 0–1.
  const srgb = value.match(/^color\(srgb ([^)]+)\)$/);
  if (srgb) {
    const [r, g, b, a = 1] = srgb[1].split(/[\s/]+/).filter(Boolean).map(Number);
    return [r * 255, g * 255, b * 255, a];
  }
  return null;
}

/** True when the first solid background behind `start` is dark. */
function onDarkGround(start: Element | null): boolean {
  for (let n = start; n && n !== document.documentElement; n = n.parentElement) {
    const c = parseColor(getComputedStyle(n).backgroundColor);
    if (!c || c[3] < 0.5) continue;
    const [r, g, b] = c;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
  }
  return false;
}

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const el = dotRef.current;
    if (!el) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");
    el.style.opacity = "0";

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    let lastTarget: EventTarget | null = null;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.style.opacity = "1";

      wake();

      // Only re-read the ground when the pointer crosses onto a new element.
      if (e.target !== lastTarget) {
        lastTarget = e.target;
        el.dataset.tone = onDarkGround(e.target as Element) ? "light" : "dark";
      }

      const target = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      const label = target?.dataset.cursor ?? "";
      el.dataset.state = label ? "active" : "idle";
      const text = el.firstElementChild as HTMLElement;
      if (text.textContent !== label) text.textContent = label;
    };

    const onLeave = () => {
      el.style.opacity = "0";
    };

    // The loop parks itself once it has caught up. A cursor that runs rAF
    // forever keeps the compositor awake on an otherwise idle page.
    let running = false;
    const tick = () => {
      const dx = tx - x;
      const dy = ty - y;
      x += dx * 0.22;
      y += dy * 0.22;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      root.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      data-state="idle"
      data-tone="dark"
      className={[
        "pointer-events-none fixed left-0 top-0 z-[90] grid place-items-center rounded-full",
        "border border-[var(--text-default)] transition-[width,height,background-color,border-color,opacity] duration-300 ease-[var(--ease-house)]",
        "size-2 data-[state=active]:size-14",
        "data-[state=active]:border-[var(--accent)] data-[state=active]:bg-[color-mix(in_srgb,var(--accent)_18%,transparent)]",
        "data-[state=active]:backdrop-blur-sm",
        // Over dark ground: white ring, white label, a faint white fill.
        "data-[tone=light]:border-white",
        "data-[state=active]:data-[tone=light]:border-white data-[state=active]:data-[tone=light]:bg-white/15",
      ].join(" ")}
    >
      <span className="type-label text-[9px] text-[var(--text-default)] opacity-0 transition-[opacity,color] duration-200 [[data-state=active]>&]:opacity-100 [[data-tone=light]>&]:text-white" />
    </div>
  );
}
