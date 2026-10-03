/**
 * MEDIA MANIFEST — the single swap point for every asset on the site.
 *
 * Each slot ships as `procedural`, which renders the LayerField (the logo's
 * own isometric geometry, animated). Nothing is downloaded, nothing is
 * attributed, nothing can be taken down.
 *
 * To use real footage instead, change ONE entry:
 *
 *   heroOne: {
 *     kind: "video",
 *     landscape: "/media/hero/one-16x9.mp4",
 *     portrait:  "/media/hero/one-9x16.mp4",   // mobile reframe
 *     poster:    "/media/hero/one.webp",
 *     alt: "What is happening in the shot",
 *   }
 *
 * Sources that are free for commercial use with no attribution required:
 *   video  — pexels.com/videos · coverr.co · mixkit.co/free-stock-video
 *   stills — unsplash.com · pexels.com
 * Download into /public/media/ — never hot-link a third party in production.
 *
 * Encode video as H.264 MP4 (plus VP9 WebM if you want the extra ~20%),
 * cap the long edge at 1920, target under 2.5MB, and always ship a poster.
 */

export type MediaSlot =
  | { kind: "procedural"; seed: number; density?: number; speed?: number; alt?: string }
  | {
      kind: "video";
      landscape: string;
      portrait?: string;
      poster: string;
      alt: string;
    }
  | { kind: "image"; src: string; alt: string; width?: number; height?: number };

export const media = {
  // Hero: a fast-cut 13s edit (city, traffic, people at work), looping.
  // Footage from Pexels and Coverr — both free for commercial use with no
  // attribution required (pexels.com/license, coverr.co/license).
  heroOne: {
    kind: "video",
    landscape: "/media/hero/edit-16x9.mp4",
    portrait: "/media/hero/edit-9x16.mp4",
    poster: "/media/hero/edit-poster.jpg",
    alt: "A fast montage of city traffic, people on the move and founders at work",
  },

  // Footer hero.
  footer: { kind: "procedural", seed: 7, density: 30, speed: 0.6 },

  // Brands we've built — swap each for a real photo or film of the brand.
  brandOne: {
    kind: "image",
    src: "/media/brands/brandlayer-site.jpg",
    alt: "A laptop in a café showing the Brand Layer homepage",
    width: 2000,
    height: 1116,
  }, // Brand Layer
  brandTwo: {
    kind: "image",
    src: "/media/brands/landr-site.webp",
    alt: "A desktop computer showing the LANDR homepage with founder Niklas Lohne-Hansen",
    width: 1376,
    height: 768,
  }, // LANDR
  brandThree: {
    kind: "image",
    src: "/media/brands/perlemor.webp",
    alt: "A laptop showing the Perlemor homepage, styled outdoors on a coastal terrace with jewellery, flowers and a drink",
    width: 1448,
    height: 1086,
  }, // Perlemor

  // About.
  // Swap for a real photo of the founder when there is one.
  about: {
    kind: "video",
    landscape: "/media/about/brand-cards-loop.mp4",
    poster: "/media/about/brand-cards-poster.jpg",
    alt: "A clip from the Brand Layer film: name, colour and type cards for a new brand",
  },
} satisfies Record<string, MediaSlot>;

export type MediaKey = keyof typeof media;
export const getMedia = (key: string): MediaSlot =>
  (media as Record<string, MediaSlot>)[key] ?? media.heroOne;
