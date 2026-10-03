"use client";

import { useEffect, useRef } from "react";

/**
 * LAYER FIELD
 *
 * An extruded isometric terrain rendered in the mark's own 2:1 space
 * (atan(0.5) = 26.565deg). Every tile is a plane; the field is planes stacked
 * to different elevations. It is the logo, at scale, moving.
 *
 * PERFORMANCE
 * The naive version of this ran the page at 0.8fps. Four things fixed it, in
 * descending order of impact:
 *
 *   1. Only ONE field animates at a time. The hero stacks three slides; all
 *      three used to render every frame even at opacity 0. `paused` stops the
 *      rAF loop outright rather than merely skipping the draw.
 *   2. Colours are read once. `getComputedStyle` used to run once per canvas
 *      per frame, forcing a full style recalc 180x/second.
 *   3. Draw calls are batched per diagonal. Tiles on one diagonal share a
 *      depth and cannot overlap each other, so a whole diagonal's caps, side
 *      faces and strokes each collapse into a single path — ~7 draw calls per
 *      diagonal instead of 4 per tile. Painter ordering across diagonals is
 *      preserved, so the stacking still reads correctly.
 *   4. Fixed tile budget, 30fps cap, DPR capped at 1.5. The drift is slow
 *      enough that none of this is visible.
 *
 * Scratch buffers are allocated once and reused, so a steady-state frame does
 * no allocation at all and gives the GC nothing to collect.
 */

const FPS = 30;
const FRAME_MS = 1000 / FPS;
const TILE_BUDGET = 560;
const MAX_DPR = 1.5;

// Side faces use fixed alphas so a whole diagonal fills in one call.
const ALPHA_LEFT = 0.1;
const ALPHA_RIGHT = 0.17;
const ALPHA_CAP = 0.96;
// Stroke alpha quantised into buckets so strokes batch too.
const STROKE_ALPHAS = [0.16, 0.24, 0.32, 0.42];

export function LayerField({
  seed = 1,
  density = 22,
  className,
  speed = 1,
  paused = false,
}: {
  seed?: number;
  density?: number;
  className?: string;
  speed?: number;
  paused?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let visible = true;
    let running = false;
    let lastFrame = 0;
    let w = 0;
    let h = 0;

    // Deterministic per-seed offsets so each field reads as a different place
    // in the same world, not a different world.
    const s = seed * 12.9898;
    const oa = Math.sin(s) * 43758.5453;
    const ob = Math.sin(s * 1.7) * 12345.6789;
    const phaseA = (oa - Math.floor(oa)) * 6.283;
    const phaseB = (ob - Math.floor(ob)) * 6.283;

    // ---- Colours: read once, from the canvas itself ----------------------
    // Sections re-declare the colour tokens locally (.tone-stone, .tone-deep),
    // so the canvas must resolve them where it sits, not on <html>.
    const cs = getComputedStyle(canvas);
    const fg = cs.getPropertyValue("--text-default").trim() || "#141414";
    const bg = cs.getPropertyValue("--bg-default").trim() || "#ffffff";
    const accent = cs.getPropertyValue("--accent").trim() || "#9c4a27";

    // ---- Geometry, recomputed only on resize -----------------------------
    let cols = 0;
    let rows = 0;
    let tileW = 0;
    let tileH = 0;
    let amp = 0;
    let originX = 0;
    let originY = 0;

    // Reused scratch buffers — a steady-state frame allocates nothing.
    let sx = new Float32Array(0);
    let sy = new Float32Array(0);
    let sr = new Float32Array(0);
    let sb = new Uint8Array(0);

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = density;
      tileW = (w * 1.9) / cols;
      tileH = tileW / 2;
      amp = tileH * 2.1;
      originX = w / 2;
      // Start above the frame so the terrain bleeds off every edge rather
      // than sitting as an island with empty sky above it.
      originY = -tileH * 2;

      const need = Math.ceil((h - originY + amp + tileH * 4) / (tileH / 2)) - cols;
      rows = Math.max(4, Math.min(need, Math.floor(TILE_BUDGET / cols)));

      const perDiagonal = Math.min(cols, rows) + 1;
      if (sx.length < perDiagonal) {
        sx = new Float32Array(perDiagonal);
        sy = new Float32Array(perDiagonal);
        sr = new Float32Array(perDiagonal);
        sb = new Uint8Array(perDiagonal);
      }
    };

    const draw = (now: number) => {

      ctx.clearRect(0, 0, w, h);
      const time = reduced ? 0 : now * 0.00016 * speed;

      const halfW = tileW / 2;
      const halfH = tileH / 2;

      // Painter's algorithm across diagonals: back to front. Within one
      // diagonal tiles share a depth and never overlap, so each diagonal's
      // geometry can be batched into a handful of paths.
      for (let d = 0; d < cols + rows; d++) {
        const gxMin = Math.max(0, d - rows + 1);
        const gxMax = Math.min(d, cols - 1);
        let n = 0;

        for (let gx = gxMin; gx <= gxMax; gx++) {
          const gy = d - gx;

          const elev =
            Math.sin(gx * 0.42 + time + phaseA) +
            Math.sin(gy * 0.55 + time * 0.8 + phaseB) +
            Math.sin((gx + gy) * 0.28 - time * 0.62);

          const norm = (elev + 3) / 6; // 0..1
          const lift = norm * amp;
          const cx = originX + (gx - gy) * halfW;
          const cy = originY + (gx + gy) * halfH - lift;

          if (cx < -tileW || cx > w + tileW || cy < -tileH * 4 || cy > h + tileH * 4) continue;

          sx[n] = cx;
          sy[n] = cy;
          sr[n] = lift + tileH * 0.9;
          // Accent tiles are marked as bucket 4. Rare, on purpose.
          const isAccent = (gx * 7 + gy * 13 + seed * 3) % 41 === 0 && norm > 0.62;
          sb[n] = isAccent ? 4 : Math.min(3, (norm * 4) | 0);
          n++;
        }

        if (n === 0) continue;

        // Left faces — one path, one fill.
        ctx.fillStyle = fg;
        ctx.globalAlpha = ALPHA_LEFT;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const cx = sx[i], cy = sy[i], r = sr[i];
          ctx.moveTo(cx - halfW, cy);
          ctx.lineTo(cx, cy + halfH);
          ctx.lineTo(cx, cy + halfH + r);
          ctx.lineTo(cx - halfW, cy + r);
          ctx.closePath();
        }
        ctx.fill();

        // Right faces.
        ctx.globalAlpha = ALPHA_RIGHT;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const cx = sx[i], cy = sy[i], r = sr[i];
          ctx.moveTo(cx + halfW, cy);
          ctx.lineTo(cx, cy + halfH);
          ctx.lineTo(cx, cy + halfH + r);
          ctx.lineTo(cx + halfW, cy + r);
          ctx.closePath();
        }
        ctx.fill();

        // Caps, filled with the page colour so the stack stays legible.
        ctx.globalAlpha = ALPHA_CAP;
        ctx.fillStyle = bg;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const cx = sx[i], cy = sy[i];
          ctx.moveTo(cx, cy - halfH);
          ctx.lineTo(cx + halfW, cy);
          ctx.lineTo(cx, cy + halfH);
          ctx.lineTo(cx - halfW, cy);
          ctx.closePath();
        }
        ctx.fill();

        // Hairlines, one pass per alpha bucket.
        ctx.lineWidth = 1;
        for (let b = 0; b <= 4; b++) {
          let has = false;
          ctx.beginPath();
          for (let i = 0; i < n; i++) {
            if (sb[i] !== b) continue;
            has = true;
            const cx = sx[i], cy = sy[i];
            ctx.moveTo(cx, cy - halfH);
            ctx.lineTo(cx + halfW, cy);
            ctx.lineTo(cx, cy + halfH);
            ctx.lineTo(cx - halfW, cy);
            ctx.closePath();
          }
          if (!has) continue;
          if (b === 4) {
            ctx.strokeStyle = accent;
            ctx.globalAlpha = 0.9;
          } else {
            ctx.strokeStyle = fg;
            ctx.globalAlpha = STROKE_ALPHAS[b];
          }
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      if (now - lastFrame >= FRAME_MS) {
        lastFrame = now;
        draw(now);
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      lastFrame = 0;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const sync = () => {
      if (visible && !pausedRef.current && !document.hidden) start();
      else stop();
    };

    layout();
    draw(0);
    sync();

    const ro = new ResizeObserver(() => {
      layout();
      draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        sync();
      },
      { rootMargin: "120px" }
    );
    io.observe(canvas);

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    // Re-sync when the `paused` prop flips without re-running the effect.
    const poll = window.setInterval(sync, 250);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      clearInterval(poll);
    };
  }, [seed, density, speed]);

  return <canvas ref={ref} aria-hidden="true" className={className ?? "h-full w-full"} />;
}
