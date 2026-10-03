"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lockup } from "@/components/chrome/Lockup";

/**
 * The header is the lockup and nothing else — navigation lives in the command
 * bar at the bottom. mix-blend-difference means it inverts itself against
 * whatever it happens to be over, so it stays legible on paper, stone and the
 * deep footer without a single line of theme wiring.
 *
 * Clicking it always returns home, scrolled to the top.
 *
 * It also publishes its own measured height as --header-h. Pages pad their
 * first section by exactly that, which makes the gap under the lockup equal
 * the gap above it — the header's own padding on both sides — so the mark
 * reads as optically centred between the top of the screen and the headline
 * instead of sitting closer to one than the other. Measuring beats guessing:
 * the height changes with breakpoint and with the font once it loads.
 */
export function Header() {
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const publish = () => {
      const h = Math.round(el.getBoundingClientRect().height);
      if (h > 0) document.documentElement.style.setProperty("--header-h", `${h}px`);
    };

    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    // Re-measure once the real faces land; fallback metrics change the height.
    document.fonts?.ready.then(publish).catch(() => {});

    return () => ro.disconnect();
  }, []);

  const goHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab, download, etc.) behave normally.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    router.push("/");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <header
      ref={ref}
      data-site-header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center p-5 mix-blend-difference"
    >
      <Link
        href="/"
        onClick={goHome}
        data-header-lockup
        className="pointer-events-auto text-white"
        aria-label="Brand Layer — home"
      >
        <Lockup className="text-[20px] tablet:text-[26px]" />
      </Link>
    </header>
  );
}
