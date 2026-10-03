"use client";

import { useLayoutEffect } from "react";

/**
 * Two-stage motion bootstrap.
 *
 * `.motion-ready` puts every animated element into its START state. Because
 * that class can only land after hydration, applying the transitions at the
 * same moment makes the browser animate INTO the start state — the hero video
 * visibly wiped itself closed over 900ms on load before it could open.
 *
 * `.motion-armed` therefore lands one frame later, and carries the
 * transitions. The start state snaps instantly; only the reveal animates.
 *
 * Everything ships in its RESTING state, so if JS never runs the page is
 * fully readable rather than a screen of invisible elements.
 */
export function MotionProvider() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");

    // Two frames: one to paint the start state, one to arm transitions.
    const arm = () => root.classList.add("motion-armed");

    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(arm);
    });

    // rAF can be throttled hard (a background tab pauses it outright, and some
    // embedded webviews run it at a few frames per second). Arm on a timer too
    // so transitions are never left permanently disabled.
    const fallback = window.setTimeout(arm, 250);

    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      clearTimeout(fallback);
    };
  }, []);

  return null;
}
