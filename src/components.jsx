/* Shared small components */
const { useEffect, useState, useRef, useMemo } = React;

/* Brand B logomark inline SVG (matches the asset's geometry) */
const LogoB = ({ className = "h-7 w-7" }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="bg-dark" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#321655" />
        <stop offset="1" stopColor="#4B257F" />
      </linearGradient>
      <linearGradient id="bg-mid" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#5E309C" />
        <stop offset="1" stopColor="#6D48A8" />
      </linearGradient>
      <linearGradient id="bg-light" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#B9A0DD" />
        <stop offset="1" stopColor="#987AD1" />
      </linearGradient>
    </defs>
    {/* dark wedge / spine */}
    <path d="M22 8 L42 14 L42 92 L22 86 Z" fill="url(#bg-dark)" />
    {/* light bowl */}
    <path d="M42 14 C70 14 84 26 84 38 C84 50 72 56 56 56 L42 56 Z" fill="url(#bg-light)" />
    {/* mid bowl */}
    <path d="M42 50 C72 50 86 60 86 72 C86 84 72 92 56 92 L42 92 Z" fill="url(#bg-mid)" />
    {/* highlight */}
    <path d="M30 10 L40 12 L40 22 L26 18 Z" fill="rgba(255,255,255,0.18)" />
  </svg>
);

const Wordmark = ({ className = "h-7" }) => (
  <span className={"inline-flex items-center " + className}>
    <img src="assets/wordmark.png" alt="Brand Layer" className="h-full w-auto select-none" draggable="false" />
  </span>
);

const Pill = ({ children, tone = "light" }) => (
  <span className={
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium tracking-wide " +
    (tone === "light"
      ? "bg-white hairline text-ink/70"
      : "bg-brand-700/15 text-brand-700 ring-1 ring-brand-500/25")
  }>
    {children}
  </span>
);

const ArrowUR = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
    <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ButtonPrimary = ({ children, onClick, className = "", ...rest }) => (
  <button onClick={onClick} {...rest} className={
    "group relative inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-[0_8px_30px_-10px_rgba(94,48,156,0.55)] ring-1 ring-white/10 transition-all hover:bg-brand-700 active:scale-[.98] " + className
  }>
    <span className="relative z-10">{children}</span>
    <span className="relative z-10 grid h-5 w-5 place-items-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
      <ArrowUR className="h-3 w-3" />
    </span>
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
      <span className="sweep absolute -inset-y-2 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </span>
  </button>
);

const ButtonGhost = ({ children, onClick, className = "" }) => (
  <button onClick={onClick} className={
    "inline-flex items-center gap-2 rounded-full bg-white/70 hairline px-5 py-3 text-sm font-medium text-ink transition-all hover:bg-white " + className
  }>
    {children}
  </button>
);

/* Decorative B watermark for sections */
const BMark = ({ className = "" , opacity = 0.05 }) => (
  <img src="assets/logo.png" alt="" aria-hidden="true"
    className={"pointer-events-none select-none " + className}
    style={{ opacity }} draggable="false" />
);

/* Section Heading kit */
const Eyebrow = ({ children }) => (
  <div className="inline-flex items-center gap-2 rounded-full bg-white hairline px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-brand-700">
    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
    {children}
  </div>
);

const SectionTitle = ({ kicker, title, sub }) => (
  <div className="mx-auto max-w-3xl text-center">
    <Eyebrow>{kicker}</Eyebrow>
    <h2 className="mt-5 text-balance text-[44px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[56px]">{title}</h2>
    {sub && <p className="mt-4 text-pretty text-[17px] leading-relaxed text-ink/60">{sub}</p>}
  </div>
);

/* Tiny SVG icons */
const Icon = {
  Sparkle: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/></svg>,
  Bolt: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" strokeLinejoin="round"/></svg>,
  Cart: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M3 4h2l2.4 12.2a2 2 0 002 1.6h8.6a2 2 0 002-1.6L21.5 8H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>,
  Compass: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5L13 13l-4.5 2.5L11 11l4.5-2.5z"/></svg>,
  Pen: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M3 21l4-1 11-11-3-3L4 17l-1 4z"/><path d="M14 6l3 3"/></svg>,
  Rocket: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M14 4s4 0 6 2 2 6 2 6-3 1-6 4-6 4-6 4-2-4-4-6-6-2-6-2 1-3 4-6 6-2 6-2 4 0 6 0z"/><circle cx="15.5" cy="8.5" r="1.5"/></svg>,
  Code: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/></svg>,
  Play: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5v14l11-7z"/></svg>,
};

Object.assign(window, { LogoB, Wordmark, Pill, ArrowUR, ButtonPrimary, ButtonGhost, BMark, Eyebrow, SectionTitle, Icon });
