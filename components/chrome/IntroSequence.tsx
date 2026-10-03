"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Lockup } from "@/components/chrome/Lockup";
import { releaseInView } from "@/lib/inview";
import { markIntroDone } from "@/lib/intro";

// Last layer starts sliding at 2130ms and runs 720ms.
const TOTAL = 2850;
const FALLBACK = TOTAL + 1500;

/**
 * INTRO SEQUENCE — plays on every load and refresh.
 *
 * The two planes fly in along their own isometric axis and land in register,
 * the wordmark unmasks from behind them, and the whole lockup FLIPs into the
 * real header position. Then the curtain shears upward into a triangle and
 * that triangle leaves to the left as THREE stacked planes — ink, grey, light
 * grey — each trailing the one before it, the last uncovering the page.
 *
 * DRIVEN BY ANIMATION EVENTS, NOT TIMERS.
 * An earlier version unmounted on setTimeout(1770). That timer starts when the
 * effect runs but the CSS starts at first paint, so it always ran ahead and
 * tore the overlay down mid-lift. Every stage now keys off a real animation
 * event, so it cannot be cut short however slow the first paint is. The timer
 * survives only as a fallback.
 *
 *   lift starts    -> release the scroll gate, so the headline rises into view
 *                     as the curtain shears away
 *   flip lands     -> hand the lockup over to the real header
 *   ink plane goes -> markIntroDone(), so the hero video begins uncovering
 *                     while the planes are still sweeping off, rather than
 *                     waiting for an empty beat after they have all gone
 *   last plane out -> unmount
 */
let decision: "play" | "skip" | null = null;

function decide(): "play" | "skip" {
  if (decision) return decision;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  decision = reduced ? "skip" : "play";
  return decision;
}

export function IntroSequence() {
  const [show, show_] = useState<boolean | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const lockupRef = useRef<HTMLDivElement>(null);

  // Decide before paint so there is never a flash of the page behind it.
  useLayoutEffect(() => {
    if (decide() === "skip") {
      show_(false);
      releaseInView();
      markIntroDone();
      return;
    }
    show_(true);
    document.documentElement.classList.add("intro-running");
    return () => document.documentElement.classList.remove("intro-running");
  }, []);

  // Measure the FLIP against the real header so the handoff is pixel-exact at
  // every breakpoint rather than hard-coded.
  useLayoutEffect(() => {
    if (!show) return;
    const from = lockupRef.current;
    const to = document.querySelector<HTMLElement>("[data-header-lockup]");
    if (!from || !to) return;

    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    if (!a.height || !b.height) return;

    from.style.setProperty("--flip-s", String(b.height / a.height));
    from.style.setProperty("--flip-x", `${b.left + b.width / 2 - (a.left + a.width / 2)}px`);
    from.style.setProperty("--flip-y", `${b.top + b.height / 2 - (a.top + a.height / 2)}px`);
  }, [show]);

  useEffect(() => {
    if (!show) return;
    const root = rootRef.current;
    if (!root) return;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      releaseInView();
      markIntroDone();
      document.documentElement.classList.remove("intro-running");
      show_(false);
    };

    // Every stage is identified by animation name, so the order of events
    // never has to be assumed.
    const onStart = (e: AnimationEvent) => {
      if (e.animationName === "intro-lift") {
        releaseInView();
        return;
      }
      // The ink plane pulling away is the cue for the hero video to start.
      if (
        e.animationName === "intro-slide" &&
        (e.target as HTMLElement)?.dataset?.layer === "front"
      ) {
        markIntroDone();
      }
    };

    const onEnd = (e: AnimationEvent) => {
      if (e.animationName === "intro-flip") {
        // The lockup has landed on the header slot: bring the real one in.
        document.documentElement.classList.remove("intro-running");
        return;
      }
      // The hindmost plane clearing the screen ends the intro.
      if (
        e.animationName === "intro-slide" &&
        (e.target as HTMLElement)?.dataset?.layer === "back"
      ) {
        finish();
      }
    };

    root.addEventListener("animationstart", onStart);
    root.addEventListener("animationend", onEnd);

    // If animation events never arrive, do not strand the page behind it.
    const fallback = window.setTimeout(finish, FALLBACK);

    return () => {
      root.removeEventListener("animationstart", onStart);
      root.removeEventListener("animationend", onEnd);
      clearTimeout(fallback);
      releaseInView();
      markIntroDone();
      document.documentElement.classList.remove("intro-running");
    };
  }, [show]);

  if (!show) return null;

  return (
    <div ref={rootRef} className="intro-root" role="presentation" aria-hidden="true">
      {/* DOM order is stacking order: back plane first, ink plane on top. */}
      <div className="intro-layer" data-layer="back" />
      <div className="intro-layer" data-layer="mid" />
      <div className="intro-layer" data-layer="front" />

      <div ref={lockupRef} className="intro-lockup">
        <Lockup animated className="text-[clamp(28px,7vw,64px)]" />
      </div>
    </div>
  );
}
