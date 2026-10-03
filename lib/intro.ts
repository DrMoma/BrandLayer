"use client";

import { useEffect, useState } from "react";

/**
 * A one-shot signal for "the intro has finished".
 *
 * Anything that should hold until the curtain is fully gone subscribes here
 * rather than guessing with its own timer. Timers drift against CSS — the
 * animation starts at first paint, a timer starts when the effect runs — so
 * the only reliable source of truth is the animation's own end event, which
 * is what fires this.
 */
let done = false;
const subscribers = new Set<() => void>();

export function markIntroDone() {
  if (done) return;
  done = true;
  for (const fn of subscribers) fn();
  subscribers.clear();
}

export function isIntroDone() {
  return done;
}

export function useIntroDone() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (done) {
      setReady(true);
      return;
    }
    const fn = () => setReady(true);
    subscribers.add(fn);
    return () => {
      subscribers.delete(fn);
    };
  }, []);

  return ready;
}
