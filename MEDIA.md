# Swapping media

Every image and video on the site is one entry in **`content/media.ts`**.
Components never know which kind a slot is, so changing one is a one-line edit
with no other consequences.

## What ships today

All slots are `procedural` — the `LayerField` canvas, an animated isometric
terrain generated from the logo's own 2:1 geometry. Zero licence risk, zero
attribution, no multi-megabyte video on the critical path, and each slot gets a
different `seed` so it reads as a different place in the same world.

```ts
heroOne: { kind: "procedural", seed: 3, density: 20 },
```

`seed` changes the terrain · `density` sets tile count (16 coarse → 30 fine) ·
`speed` scales the drift (default 1).

## Swapping in a video

```ts
heroOne: {
  kind: "video",
  landscape: "/media/hero/one-16x9.mp4",
  portrait:  "/media/hero/one-9x16.mp4",   // used below 768px — see note
  poster:    "/media/hero/one.webp",
  alt:       "What is actually happening in the shot",
},
```

## Swapping in a still

```ts
caseTwo: {
  kind: "image",
  src: "/media/work/case-two.webp",
  alt: "What the image shows",
  width: 1600,
  height: 1200,
},
```

## The portrait reframe matters

The hero is 16:9 on desktop and **351:527 portrait** on mobile — the same
proportion the reference site uses, and the reason its hero feels designed for
a phone rather than letterboxed onto one. Supply a real portrait crop, not a
centre-cropped landscape: the subject usually needs repositioning.

## Where to get it

All free for commercial use, no attribution required:

- **Video** — [pexels.com/videos](https://www.pexels.com/videos/) ·
  [coverr.co](https://coverr.co) · [mixkit.co](https://mixkit.co/free-stock-video/)
- **Stills** — [unsplash.com](https://unsplash.com) · [pexels.com](https://www.pexels.com)

Download into `public/media/`. **Never hot-link a third party in production** —
you inherit their uptime, their privacy policy and their right to delete the file.

## Encoding

```bash
# 1920 long edge, good quality, web-safe H.264
ffmpeg -i source.mov -vf "scale=1920:-2" -c:v libx264 -crf 23 \
       -preset slow -pix_fmt yuv420p -movflags +faststart -an out.mp4

# portrait crop for mobile (351:527 ≈ 2:3)
ffmpeg -i source.mov -vf "crop=ih*351/527:ih,scale=810:-2" -c:v libx264 \
       -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart -an out-9x16.mp4

# poster
ffmpeg -i out.mp4 -vframes 1 -q:v 2 poster.webp
```

Targets: under **2.5MB** per clip, always `-an` (they play muted, so audio is
dead weight), always ship a poster.

Video is already `muted loop playsInline`, `preload="none"`, and gated on an
IntersectionObserver — nothing decodes until it is near the viewport.

## Art direction

The palette is monochrome, so choose footage that stays legible in it: dark,
high contrast, low saturation. Abstract computation, macro glass and liquid,
architecture at night, hands on a device, studio light. Anything with strong
brand colours of its own will fight the design rather than sit in it.
