"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { Media } from "@/components/blocks/Media";
import { getMedia } from "@/content/media";
import { cn } from "@/lib/cn";

/** Hairline separator, inset to the page margin, drawn in from the left. */
export function Rule({ className }: { className?: string }) {
  return (
    <div className={cn("canvas", className)}>
      <Reveal
        anim="rule"
        className="h-px w-full bg-[var(--stroke-soft)]"
        role="presentation"
      />
    </div>
  );
}

/** Small mono label. The technical voice of the system. */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("type-label block text-[var(--text-neutral)]", className)}>
      {children}
    </span>
  );
}

/**
 * Section heading. Uppercase, tight, two authored lines, revealed line by line.
 * Sits in 8 of 12 columns on desktop — never the full width, so it always has
 * somewhere to breathe.
 */
export function SectionHead({
  kicker,
  title,
  className,
}: {
  kicker?: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-[var(--space-block)]", className)}>
      {kicker && (
        <Reveal>
          <Label>{kicker}</Label>
        </Reveal>
      )}
      <LineReveal
        as="h2"
        text={title}
        className="type-head text-[var(--text-default)]"
        lineClassName="block"
      />
    </div>
  );
}

/**
 * MEDIA FRAME
 *
 * Composes the three media behaviours without letting them fight:
 *   figure          clip-path curtain
 *   > div           curtain's counter-scale
 *   > [data-parallax] scroll-linked translate
 *
 * Radius is always zero. Media is never rounded in this system. Video skips
 * the parallax layer: it already moves, and its pause button has to stay
 * inside the visible frame.
 */
export function Frame({
  slot,
  aspect = "16 / 9",
  priority = false,
  parallax = true,
  className,
  delay = 0,
}: {
  slot: string;
  aspect?: string;
  priority?: boolean;
  parallax?: boolean;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal
      as="figure"
      anim="curtain"
      delay={delay}
      className={cn("media-zoom relative w-full overflow-hidden bg-[var(--bg-raised)]", className)}
      style={{ aspectRatio: aspect }}
    >
      {parallax && getMedia(slot).kind !== "video" ? (
        <div data-parallax className="h-full w-full">
          <Media slot={slot} priority={priority} className="h-full w-full object-cover" />
        </div>
      ) : (
        <Media slot={slot} priority={priority} className="h-full w-full object-cover" />
      )}
    </Reveal>
  );
}

/** The signature affordance: a link that ends in an arrow which nudges on hover. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  const inner = (
    <>
      {children}
      <span className="arrow-nudge ml-[0.3em]" aria-hidden="true">
        ↘
      </span>
    </>
  );

  // mailto: stays in the current tab; anything else is a real external site,
  // so open it in a new one rather than navigating away from Brand Layer.
  if (external) {
    const isHttp = href.startsWith("http");
    return (
      <a
        href={href}
        className={cn("group link-wipe", className)}
        {...(isHttp ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cn("group link-wipe", className)}>
      {inner}
    </Link>
  );
}
