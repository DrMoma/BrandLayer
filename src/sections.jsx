/* Major sections: Nav, Hero, Marquee, Services, Process, Work, CTA, Footer */
const { useEffect: useEf, useState: useSt, useRef: useRf, useMemo: useMm } = React;

/* ---------- NAV ---------- */
function Nav() {
  const [scrolled, setScrolled] = useSt(false);
  useEf(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['Services', 'Work', 'Process', 'Pricing', 'About'];

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
      <div className={
        "pointer-events-auto mt-3 transition-all duration-500 ease-[cubic-bezier(.2,.7,.2,1)] " +
        (scrolled
          ? "w-[min(94%,860px)] mt-3"
          : "w-[min(96%,1280px)] mt-5")
      }>
        <div className={
          "flex items-center justify-between rounded-full glass hairline-strong transition-all duration-500 " +
          (scrolled ? "px-3 py-2" : "px-5 py-3")
        }>
          <a href="#" className="flex items-center gap-2">
            <Wordmark className={scrolled ? "h-5" : "h-7"} />
          </a>
          <nav className={"hidden items-center gap-1 md:flex transition-all " + (scrolled ? "text-[13px]" : "text-sm")}>
            {links.map(l => (
              <a key={l} href={"#" + l.toLowerCase()} className="rounded-full px-3.5 py-2 text-ink/70 transition hover:bg-white hover:text-ink">{l}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href="#contact" className={"hidden text-ink/70 hover:text-ink sm:inline-block transition " + (scrolled ? "text-[13px] px-2" : "text-sm px-3")}>Contact</a>
            <ButtonPrimary className={scrolled ? "px-4 py-2 text-[13px]" : ""}>Start a project</ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  const ref = useRf(null);
  const [mp, setMp] = useSt({ x: 0.5, y: 0.5 });
  useEf(() => {
    const el = ref.current; if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      setMp({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  const tx = (mp.x - 0.5) * 30;
  const ty = (mp.y - 0.5) * 30;

  return (
    <section ref={ref} className="relative isolate overflow-hidden pb-24 pt-40 sm:pt-48">
      {/* animated gradient mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 via-white to-white" />
        <div className="absolute left-[50%] top-[8%] h-[340px] w-[640px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_50%,rgba(152,122,209,0.10)_0%,transparent_65%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-7">
            <Pill tone="brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600 pulse-dot" />
              Now booking — Q3 cohorts open
            </Pill>
            <h1 className="mt-6 text-balance text-[56px] font-bold leading-[0.98] tracking-[-0.035em] sm:text-[80px] lg:text-[96px]">
              Lead your business
              <span className="block">with intention.</span>
              <span className="block bg-gradient-to-r from-brand-700 via-brand-500 to-brand-400 bg-clip-text text-transparent italic font-semibold" style={{fontFeatureSettings:'"ss01"'}}>
                Design meets craft.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-ink/65">
              We don't do generic. We build websites that work as hard as you do — engineered with modern tools (Next.js, Vercel) and the <em className="not-italic font-medium text-ink/85">shokunin spirit</em> of precision.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonPrimary onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>Book a free 15-min call</ButtonPrimary>
              <ButtonGhost>
                <Icon.Play className="h-3.5 w-3.5 text-brand-600" /> Watch reel · 1:24
              </ButtonGhost>
            </div>
            <div className="mt-10 flex items-center gap-6 text-[13px] text-ink/55">
              <div className="flex items-center gap-2">
                <span className="flex -space-x-2">
                  {[0,1,2,3].map(i => (
                    <span key={i} className="h-7 w-7 rounded-full ring-2 ring-white"
                      style={{ background: `conic-gradient(from ${i*90}deg, #987AD1, #5E309C, #B9A0DD, #987AD1)` }} />
                  ))}
                </span>
                <span><b className="text-ink">120+</b> shipped sites</span>
              </div>
              <div className="hidden h-4 w-px bg-ink/15 sm:block" />
              <div className="hidden sm:block"><b className="text-ink">4.96</b>★ avg client rating</div>
            </div>
          </div>

          {/* RIGHT — abstract 3D */}
          <div className="relative lg:col-span-5">
            <HeroVisual tx={tx} ty={ty} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Hero abstract 3D-ish shape — pure CSS layered cards rotating in space */
function HeroVisual({ tx = 0, ty = 0 }) {
  return (
    <div className="relative aspect-square w-full" style={{ perspective: '1400px' }}>
      <div className="absolute inset-0" style={{
        transformStyle: 'preserve-3d',
        transform: `rotateX(${-12 + ty*0.1}deg) rotateY(${-18 + tx*0.15}deg) rotateZ(0deg)`,
        transition: 'transform 200ms ease-out'
      }}>
        {/* glow plane */}
        <div className="absolute inset-[8%] rounded-[40px] bg-gradient-to-br from-brand-300/40 via-brand-500/30 to-brand-800/20 blur-2xl" />
        {/* big B logo, glassy */}
        <div className="absolute inset-[12%] grid place-items-center">
          <div className="relative h-full w-full">
            <div className="absolute inset-0 rounded-[44px] bg-gradient-to-br from-white/80 to-white/30 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_40px_120px_-30px_rgba(94,48,156,0.45)]"
              style={{ transform: 'translateZ(40px)' }} />
            <img src="assets/logo.png" alt=""
              className="absolute inset-[12%] h-[76%] w-[76%] object-contain logo-wobble drop-shadow-[0_30px_40px_rgba(75,37,127,0.45)]" />
          </div>
        </div>

        {/* floating chips */}
        <FloatingChip style={{ top: '4%', left: '-6%', transform: 'translateZ(120px)' }} delay={0}>
          <Icon.Code className="h-3.5 w-3.5 text-brand-700" />
          <span className="font-mono text-[11px] text-ink/70">next build</span>
          <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">PASS</span>
        </FloatingChip>
        <FloatingChip style={{ top: '18%', right: '-10%', transform: 'translateZ(160px)' }} delay={1.2}>
          <span className="h-2 w-2 rounded-full bg-brand-500" />
          <span className="text-[12px] font-medium text-ink/80">Lighthouse 100</span>
        </FloatingChip>
        <FloatingChip style={{ bottom: '12%', left: '-8%', transform: 'translateZ(140px)' }} delay={0.6}>
          <Icon.Bolt className="h-3.5 w-3.5 text-brand-600" />
          <span className="text-[12px] font-medium text-ink/80">CWV · 0.02 CLS</span>
        </FloatingChip>
        <FloatingChip style={{ bottom: '0%', right: '-4%', transform: 'translateZ(100px)' }} delay={2}>
          <span className="font-mono text-[11px] text-ink/70">v1.4.0 · shipped</span>
        </FloatingChip>

        {/* orbit ring */}
        <div className="absolute inset-[6%] rounded-full border border-brand-400/30 spin-slow" />
        <div className="absolute inset-[18%] rounded-full border border-dashed border-brand-400/30" />
      </div>
    </div>
  );
}
function FloatingChip({ children, style, delay = 0 }) {
  return (
    <div className="absolute float-y" style={{ ...style, animationDelay: `${delay}s` }}>
      <div className="flex items-center gap-2 rounded-full glass hairline-strong px-3 py-1.5 shadow-[0_10px_30px_-10px_rgba(50,22,85,0.25)]">
        {children}
      </div>
    </div>
  );
}

/* ---------- MARQUEE ---------- */
function TrustedMarquee() {
  const tools = [
    { name: 'Claude', src: 'assets/AppsLogos/Claude.png', url: 'https://claude.ai' },
    { name: 'Codex', src: 'assets/AppsLogos/Codex.png', url: 'https://chatgpt.com' },
    { name: 'GitHub', src: 'assets/AppsLogos/GitHub.png', url: 'https://github.com' },
    { name: 'Next.js', src: 'assets/AppsLogos/NEXT.js.png', url: 'https://nextjs.org' },
    { name: 'Vercel', src: 'assets/AppsLogos/Vercel.png', url: 'https://vercel.com' },
    { name: 'VS Code', src: 'assets/AppsLogos/VS Code.png', url: 'https://code.visualstudio.com' },
  ];
  const row = [...tools, ...tools];
  useEf(() => {
    const el = document.getElementById('trusted-marquee');
    if (!el || document.getElementById('brand-intro')?.classList.contains('lifted')) { if (el) el.classList.add('is-visible'); return; }
    const onLift = () => el.classList.add('is-visible');
    window.addEventListener('brand:intro-lifted', onLift);
    return () => window.removeEventListener('brand:intro-lifted', onLift);
  }, []);
  return (
    <section id="trusted-marquee" className="marquee-reveal relative -mt-4 border-y border-ink/5 bg-white/60 py-5 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-6">
          <span className="shrink-0 text-[11px] uppercase tracking-[0.22em] text-ink/45">Our tools</span>
          <div className="relative flex-1 overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)' }}>
            <div className="marquee-track flex w-max items-center gap-16">
              {row.map((tool, i) => (
                <a key={i} href={tool.url} target="_blank" rel="noopener noreferrer" className="inline-flex">
                  <img src={tool.src} alt={tool.name} className="h-8 w-auto object-contain opacity-60 transition hover:opacity-100 hover:scale-110" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SERVICES with animated mini-cards ---------- */
function Services() {
  return (
    <section id="services" className="relative py-28">
      <BMark className="absolute -right-24 top-10 h-[420px] w-[420px]" opacity={0.04} />
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Eyebrow>What we build</Eyebrow>
            <h2 className="mt-5 text-balance text-[44px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[64px]">
              Services built to drive impact
            </h2>
          </div>
          <p className="max-w-sm text-pretty text-[15px] leading-relaxed text-ink/60">
            We are a small studio. We say no to most projects so the ones we take ship without compromise.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {/* Big card — Portfolio sites */}
          <div className="group bento relative col-span-12 overflow-hidden rounded-squircle bg-white hairline-strong p-7 lg:col-span-7">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-brand-700">
                  <span className="font-mono">01</span> · UI/UX DESIGN
                </div>
                <h3 className="mt-3 text-[28px] font-semibold tracking-[-0.02em]">Apps developed specifically for you</h3>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink/60">
                  Crafting intuitive, user-centered interfaces that blend clarity, beauty, and effortless interaction.
                </p>
              </div>
              <ArrowUR className="h-5 w-5 text-ink/40 transition group-hover:text-ink group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>

            {/* mini gallery preview */}
            <div className="relative mt-7 grid h-[260px] grid-cols-6 gap-3">
              <div className="col-span-3 row-span-2 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 to-amber-300">
                <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(135deg, rgba(0,0,0,0.06) 0 2px, transparent 2px 14px)" }} />
                <div className="absolute bottom-2 left-3 font-mono text-[10px] text-ink/60">— index_01.tif</div>
              </div>
              <div className="col-span-3 overflow-hidden rounded-2xl bg-gradient-to-br from-rose-200 to-rose-400">
                <div className="absolute inset-0 mix-blend-overlay" style={{ background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent 60%)" }} />
              </div>
              <div className="col-span-3 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-200 to-brand-500" />
              <div className="col-span-2 row-span-1 overflow-hidden rounded-2xl bg-ink" />
              <div className="col-span-2 row-span-1 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-300" />
              <div className="col-span-2 row-span-1 overflow-hidden rounded-2xl bg-gradient-to-br from-ink to-brand-800" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2 font-mono text-[11px] text-ink/55">
              <span className="rounded-full bg-ink/5 px-2.5 py-1">case-study</span>
              <span className="rounded-full bg-ink/5 px-2.5 py-1">CMS</span>
              <span className="rounded-full bg-ink/5 px-2.5 py-1">image-pipeline</span>
              <span className="rounded-full bg-ink/5 px-2.5 py-1">password-gates</span>
            </div>
          </div>

          {/* Code mini card — Conversion */}
          <div className="group bento relative col-span-12 overflow-hidden rounded-squircle bg-ink p-7 text-white lg:col-span-5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-brand-300">
                <span className="font-mono">02</span> · WEBSITE
              </div>
              <ArrowUR className="h-5 w-5 text-white/40" />
            </div>
            <h3 className="mt-3 text-[26px] font-semibold tracking-[-0.02em]">Sites that pay rent.</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-white/60">
              We build fast, SEO-optimized websites with clear messaging and conversion-focused design that helps turn visitors into customers.
            </p>

            {/* terminal mock */}
            <CodePreview />
          </div>

          {/* Brand card — Branding & Identity */}
          <div className="group bento relative col-span-12 overflow-hidden rounded-squircle bg-white hairline-strong p-7 lg:col-span-6">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-brand-700">
                <span className="font-mono">03</span> · BRANDING & IDENTITY
              </div>
              <ArrowUR className="h-5 w-5 text-ink/40 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <h3 className="mt-3 text-[26px] font-semibold tracking-[-0.02em]">Logos, palettes, and visual worlds.</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/60">
              We create branding that truly lives and breathes your identity. From designing memorable logos to crafting cohesive color palettes and typography, we ensure every element reflects your brand's personality. We also develop mockups and other visual assets.
            </p>
            <BrandingPreview />
          </div>

          {/* Tall card — Craft / Numbers */}
          <div className="group bento relative col-span-12 overflow-hidden rounded-squircle bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-7 text-white lg:col-span-6">
            <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(600px 200px at 80% 0%, rgba(255,255,255,0.25), transparent 60%)" }} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-brand-200">
                <span className="font-mono">↳</span> The craft layer
              </div>
              <h3 className="mt-3 max-w-xl text-[28px] font-semibold tracking-[-0.02em]">Performance, accessibility, and motion — by default.</h3>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <Stat label="Avg LCP" value="0.9s" sub="across last 12 sites" />
                <Stat label="A11y score" value="98" sub="WCAG 2.2 AA" />
                <Stat label="Bundle saved" value="-62%" sub="on relaunches" />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur flex items-center gap-3">
                  <Icon.Bolt className="h-4 w-4 text-brand-300 shrink-0" />
                  <div>
                    <div className="text-[12px] font-medium text-white">Sub-second loads</div>
                    <div className="text-[10px] text-white/55">Avg LCP under 1s</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur flex items-center gap-3">
                  <Icon.Compass className="h-4 w-4 text-brand-300 shrink-0" />
                  <div>
                    <div className="text-[12px] font-medium text-white">WCAG 2.2 AA</div>
                    <div className="text-[10px] text-white/55">Accessibility by design</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur flex items-center gap-3">
                  <Icon.Play className="h-4 w-4 text-brand-300 shrink-0" />
                  <div>
                    <div className="text-[12px] font-medium text-white">Custom motion</div>
                    <div className="text-[10px] text-white/55">GSAP · Framer Motion</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur flex items-center gap-3">
                  <Icon.Code className="h-4 w-4 text-brand-300 shrink-0" />
                  <div>
                    <div className="text-[12px] font-medium text-white">CI-baked</div>
                    <div className="text-[10px] text-white/55">Lighthouse · Bundlewatch</div>
                  </div>
                </div>
              </div>
              <MotionStrip />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
      <div className="text-[11px] uppercase tracking-widest text-white/60">{label}</div>
      <div className="mt-1 text-[34px] font-bold tracking-[-0.02em]">{value}</div>
      <div className="text-[11px] text-white/55">{sub}</div>
    </div>
  );
}

function CodePreview() {
  const [step, setStep] = useSt(0);
  useEf(() => { const id = setInterval(() => setStep(s => (s + 1) % 4), 1500); return () => clearInterval(id); }, []);
  const lines = [
    { n: 1, t: <><span className="text-brand-300">export</span> <span className="text-brand-200">async function</span> <span className="text-white">Page</span>() &#123;</> },
    { n: 2, t: <>{"  "}<span className="text-brand-300">const</span> data = <span className="text-brand-200">await</span> getProduct();</> },
    { n: 3, t: <>{"  "}<span className="text-brand-300">return</span> <span className="text-emerald-300">&lt;PDP</span> data=&#123;data&#125; <span className="text-emerald-300">/&gt;</span></> },
    { n: 4, t: <>&#125;</> },
  ];
  return (
    <div className="mt-6 overflow-hidden rounded-2xl bg-black/40 ring-1 ring-white/10">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-3 font-mono text-[11px] text-white/40">app/page.tsx</span>
        <span className="ml-auto font-mono text-[10px] text-emerald-300/80">● live</span>
      </div>
      <pre className="px-4 py-4 font-mono text-[12.5px] leading-relaxed text-white/85">
        {lines.map((l, i) => (
          <div key={i} className={"flex gap-3 " + (i === step ? "bg-white/5" : "")}>
            <span className="w-4 text-right text-white/30">{l.n}</span>
            <span>{l.t}{i === step && <span className="caret ml-0.5 inline-block h-3 w-1.5 bg-brand-300 align-middle" />}</span>
          </div>
        ))}
      </pre>
      <div className="flex items-center gap-2 border-t border-white/10 px-4 py-2 font-mono text-[11px] text-white/55">
        <span className="text-emerald-300">▲</span> compiled in 412ms · 0 errors
      </div>
    </div>
  );
}

function CartPreview() {
  const [count, setCount] = useSt(2);
  useEf(() => { const id = setInterval(() => setCount(c => (c % 3) + 1), 2200); return () => clearInterval(id); }, []);
  return (
    <div className="mt-6 overflow-hidden rounded-2xl bg-brand-50/60 hairline">
      <div className="flex items-center justify-between border-b border-ink/5 px-4 py-2.5">
        <span className="font-mono text-[11px] text-ink/55">cart.atelier.shop</span>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] text-emerald-700">200 OK · 84ms</span>
      </div>
      <div className="space-y-2 p-4">
        {[
          { n: 'Linen Overshirt — 02', p: '$248' },
          { n: 'Selvedge Carry-on', p: '$420' },
          { n: 'Walnut Side Table', p: '$612' },
        ].slice(0, count).map((it, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 hairline">
            <span className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-200 to-brand-500" />
            <div className="flex-1">
              <div className="text-[13px] font-medium">{it.n}</div>
              <div className="font-mono text-[11px] text-ink/45">qty 1</div>
            </div>
            <div className="font-mono text-[12px] text-ink/70">{it.p}</div>
          </div>
        ))}
        <div className="flex items-center justify-between rounded-xl bg-ink px-3 py-2.5 text-white">
          <span className="text-[12px] text-white/70">Checkout</span>
          <span className="font-mono text-[12px]">→ stripe</span>
        </div>
      </div>
    </div>
  );
}

function BrandingPreview() {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-white via-brand-50/70 to-white hairline">
      <div className="flex items-center justify-between border-b border-ink/5 px-4 py-2.5">
        <span className="font-mono text-[11px] text-ink/55">identity-system.fig</span>
        <span className="rounded-full bg-brand-500/15 px-2 py-0.5 font-mono text-[10px] text-brand-700">logo · color · type</span>
      </div>

      <div className="grid gap-3 p-4">
        <div className="relative overflow-hidden rounded-2xl bg-ink p-4 text-white">
          <div className="absolute inset-0 opacity-50" style={{ background: 'linear-gradient(120deg, rgba(152,122,209,0.35), transparent 48%, rgba(255,255,255,0.08))' }} />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white text-[22px] font-bold tracking-[-0.04em] text-brand-700 shadow-[0_16px_40px_-18px_rgba(255,255,255,0.7)]">B</div>
              <div>
                <div className="text-[18px] font-semibold tracking-[-0.03em]">Brand Layer</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Primary mark</div>
              </div>
            </div>
            <div className="hidden h-12 w-20 rounded-xl bg-white/10 ring-1 ring-white/15 sm:block">
              <div className="m-2 h-8 rounded-lg bg-gradient-to-r from-brand-300 via-white to-brand-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {['#0B0710','#321655','#5E309C','#B9A0DD','#F4F0FB'].map((c, i) => (
            <div key={i} className="h-14 rounded-xl ring-1 ring-ink/5" style={{ background: c }} />
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_1.15fr]">
          <div className="rounded-2xl bg-white p-4 hairline">
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/40">Typography</div>
            <div className="mt-2 flex items-end gap-3">
              <div className="text-[46px] font-bold leading-none tracking-[-0.04em] text-ink">Aa</div>
              <div className="pb-1 font-mono text-[10px] leading-relaxed text-ink/45">
                DM Sans<br />DM Mono
              </div>
            </div>
          </div>

          <div className="relative min-h-[120px] overflow-hidden rounded-2xl bg-brand-100/70 p-4 hairline">
            <div className="absolute right-4 top-4 h-16 w-24 rotate-3 rounded-xl bg-white p-2 shadow-[0_18px_44px_-24px_rgba(50,22,85,0.55)]">
              <div className="h-5 rounded-md bg-brand-700" />
              <div className="mt-2 h-2 w-12 rounded-full bg-ink/15" />
              <div className="mt-1 h-2 w-16 rounded-full bg-ink/10" />
            </div>
            <div className="absolute bottom-4 right-16 h-16 w-11 -rotate-6 rounded-lg bg-gradient-to-br from-brand-700 to-brand-400 shadow-[0_18px_44px_-24px_rgba(50,22,85,0.55)]" />
            <div className="relative max-w-[150px]">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-700/70">Mockups</div>
              <div className="mt-2 text-[17px] font-semibold leading-tight tracking-[-0.02em] text-ink">Assets that feel like the same brand everywhere.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MotionStrip() {
  return (
    <div className="mt-7 flex gap-3 overflow-x-auto">
      {['squircle','glass','grid','spring','marquee','parallax','scroll-tied','letterspace'].map((t, i) => (
        <span key={i} className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 font-mono text-[11px] text-white/80 ring-1 ring-white/15">{t}</span>
      ))}
    </div>
  );
}

/* ---------- PROCESS ---------- */
function Process() {
  const steps = [
    { n: '01', t: 'Strategy', sub: 'Discovery & positioning', body: 'A two-week intensive: stakeholder interviews, competitor teardown, and a content map. You leave with a written brief everyone agrees on.', side: 'right' },
    { n: '02', t: 'Design', sub: 'Brand & interface', body: 'High-fidelity in Figma, prototyped in code from day one. We design with the real type, real copy, and real components — never lorem.', side: 'left' },
    { n: '03', t: 'Deployment', sub: 'Build, ship, measure', body: 'Engineered on Next.js + Vercel, instrumented with analytics on day one. We hand you a Notion runbook and stay on for a 30-day polish window.', side: 'right' },
  ];
  return (
    <section id="process" className="relative bg-gradient-to-b from-white to-brand-50/40 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle kicker="The process" title={<>Three steps. <span className="bg-gradient-to-r from-brand-700 to-brand-400 bg-clip-text text-transparent italic">No hand-offs.</span></>} sub="One small team, end-to-end. The same designer who sketches your hero is the engineer who deploys it." />

        <div className="relative mx-auto mt-20 max-w-5xl">
          {/* spine */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-brand-300 to-transparent md:block" />

          <div className="space-y-20">
            {steps.map((s, i) => (
              <ProcessRow key={s.n} {...s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessRow({ n, t, sub, body, side, index }) {
  const isRight = side === 'right';
  return (
    <div className={"relative grid grid-cols-1 items-center gap-8 md:grid-cols-2 " + (isRight ? "" : "")}>
      {/* node on spine */}
      <div className="absolute left-1/2 top-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 md:block">
        <div className="h-full w-full rounded-full bg-white ring-2 ring-brand-500" />
        <div className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-brand-700" />
      </div>

      {/* number */}
      <div className={(isRight ? "md:order-1" : "md:order-2") + " md:px-10"}>
        <div className="flex items-baseline gap-3">
          <span className="text-[120px] font-bold leading-none tracking-[-0.04em] text-ink/90 sm:text-[160px]" style={{
            background: 'linear-gradient(180deg, #321655 0%, #8259C5 60%, #B9A0DD 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>{n}</span>
        </div>
        <div className="mt-2 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-brand-700">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> {sub}
        </div>
        <h3 className="mt-3 text-[36px] font-bold tracking-[-0.02em]">{t}</h3>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink/65">{body}</p>
      </div>

      {/* visual */}
      <div className={(isRight ? "md:order-2" : "md:order-1") + " md:px-6"}>
        <ProcessCard step={n} index={index} />
      </div>
    </div>
  );
}

function ProcessCard({ step, index }) {
  if (step === '01') {
    return (
      <div className="relative overflow-hidden rounded-squircle bg-white p-5 hairline-strong shadow-[0_30px_80px_-40px_rgba(50,22,85,0.35)]">
        <div className="flex items-center justify-between">
          <div className="font-mono text-[11px] text-ink/45">brief.md</div>
          <span className="rounded-full bg-brand-500/10 px-2 py-0.5 font-mono text-[10px] text-brand-700">draft 0.3</span>
        </div>
        <div className="mt-4 space-y-2">
          {[80, 65, 90, 55, 75, 40].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-sm border border-ink/15" />
              <div className="h-2 rounded-full bg-ink/[0.06]" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-5 flex gap-2">
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] text-brand-700">audience</span>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] text-brand-700">ICP</span>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] text-brand-700">jobs-to-be-done</span>
        </div>
        <BMark className="absolute -bottom-10 -right-10 h-44 w-44" opacity={0.05} />
      </div>
    );
  }
  if (step === '02') {
    return (
      <div className="relative overflow-hidden rounded-squircle bg-gradient-to-br from-brand-50 to-white p-5 hairline-strong shadow-[0_30px_80px_-40px_rgba(50,22,85,0.35)]">
        <div className="flex items-center justify-between">
          <div className="font-mono text-[11px] text-ink/45">design / hero.fig</div>
          <div className="flex -space-x-1.5">
            {[0,1,2].map(i => <span key={i} className="h-5 w-5 rounded-full ring-2 ring-white" style={{ background: `hsl(${260 + i*20}, 50%, ${60-i*8}%)` }} />)}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="aspect-square rounded-xl bg-ink" />
          <div className="aspect-square rounded-xl bg-brand-200" />
          <div className="aspect-square rounded-xl bg-white hairline" />
          <div className="aspect-square rounded-xl bg-brand-700" />
          <div className="aspect-square rounded-xl bg-gradient-to-br from-brand-300 to-brand-600" />
          <div className="aspect-square rounded-xl bg-amber-200" />
        </div>
        <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-ink/55">
          <span>type · DM Sans 96 / -3.5%</span>
          <span className="text-brand-700">grid 12 · 96px</span>
        </div>
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden rounded-squircle bg-ink p-5 text-white shadow-[0_30px_80px_-40px_rgba(50,22,85,0.55)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[11px] text-white/55">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
          <span>vercel · production</span>
        </div>
        <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 font-mono text-[10px] text-emerald-300">deploy ✓</span>
      </div>
      <div className="mt-4 space-y-2 font-mono text-[11.5px] text-white/75">
        <div><span className="text-emerald-300">›</span> next build · 1.4s</div>
        <div><span className="text-emerald-300">›</span> uploading 38 files…</div>
        <div><span className="text-emerald-300">›</span> assigning <span className="text-brand-300">brandlayer.no</span></div>
        <div><span className="text-emerald-300">›</span> done in 8.21s</div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        {[['LCP','0.8s'],['CLS','0.01'],['TBT','40ms']].map(([k,v]) => (
          <div key={k} className="rounded-xl bg-white/5 py-2 ring-1 ring-white/10">
            <div className="text-[10px] uppercase tracking-widest text-white/50">{k}</div>
            <div className="text-[18px] font-semibold">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- WORK / BENTO ---------- */
function Work() {
  return (
    <section id="work" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>Selected work</Eyebrow>
            <h2 className="mt-5 max-w-2xl text-balance text-[44px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[64px]">
              Receipts.<span className="text-ink/30"> Not deliverables.</span>
            </h2>
          </div>
          <a href="#" className="hidden items-center gap-2 rounded-full bg-white hairline px-4 py-2 text-sm text-ink/70 hover:text-ink md:inline-flex">
            All 38 case studies <ArrowUR />
          </a>
        </div>

        <div className="mt-14 grid auto-rows-[140px] grid-cols-12 gap-4">
          {/* Hero project */}
          <a href="#" className="bento group relative col-span-12 row-span-3 overflow-hidden rounded-squircle bg-gradient-to-br from-brand-800 via-brand-700 to-ink p-8 text-white md:col-span-7">
            <div className="absolute inset-0 opacity-50" style={{ background: 'radial-gradient(800px 400px at 90% 100%, rgba(185,160,221,0.45), transparent 60%)' }} />
            <div className="relative flex h-full flex-col">
              <div className="flex items-center justify-between">
                <Pill tone="light"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> 2026 · live</Pill>
                <span className="font-mono text-[11px] text-white/55">case 01</span>
              </div>
              <div className="mt-auto">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand-200">Atelier Mercer · headless commerce</div>
                <h3 className="mt-2 max-w-md text-[40px] font-semibold leading-[1.0] tracking-[-0.02em]">A clothier's archive, made to scroll like a film.</h3>
                <div className="mt-4 flex items-center gap-3 text-[12px] text-white/70">
                  <span>+184% session length</span>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span>0.6s LCP</span>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span>Shopify Hydrogen</span>
                </div>
              </div>
            </div>
          </a>

          {/* Stat tile */}
          <div className="bento col-span-6 row-span-2 overflow-hidden rounded-squircle bg-white hairline-strong p-6 md:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand-700">Field report · q2</div>
            <div className="mt-3 text-[60px] font-bold leading-none tracking-[-0.04em]">+312<span className="text-brand-500">%</span></div>
            <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-ink/60">Average lift in qualified inbound across our last 6 conversion-focused launches.</p>
            <SparkLine />
          </div>

          {/* photographer */}
          <a href="#" className="bento group relative col-span-6 row-span-2 overflow-hidden rounded-squircle md:col-span-5">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-rose-200 to-rose-400" />
            <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.06) 0 3px, transparent 3px 24px)' }} />
            <div className="relative flex h-full items-end p-6 text-ink">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/65">Lior Saadi · photo</div>
                <div className="text-[22px] font-semibold tracking-[-0.02em]">Sun-belt portfolio</div>
              </div>
              <ArrowUR className="ml-auto h-5 w-5 text-ink/60 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </a>

          {/* small video */}
          <a href="#" className="bento group relative col-span-6 row-span-2 overflow-hidden rounded-squircle bg-ink text-white md:col-span-3">
            <div className="absolute inset-0 grid place-items-center">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 blur-2xl opacity-70" />
            </div>
            <div className="relative flex h-full flex-col p-5">
              <span className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20"><Icon.Play className="h-3 w-3" /></span>
              <div className="mt-auto">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">Reel · 1:24</div>
                <div className="text-[18px] font-semibold tracking-[-0.02em]">A year in motion</div>
              </div>
            </div>
          </a>

          {/* data tile */}
          <div className="bento col-span-6 row-span-2 overflow-hidden rounded-squircle bg-brand-50 p-5 md:col-span-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand-700">Norwood SaaS · pricing page</div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[60, 92, 38].map((h, i) => (
                <div key={i} className="flex h-32 flex-col justify-end rounded-xl bg-white p-2 hairline">
                  <div className="rounded-md bg-gradient-to-t from-brand-700 to-brand-300" style={{ height: `${h}%` }} />
                  <div className="mt-1.5 text-center font-mono text-[10px] text-ink/50">{['v1','v2','v3'][i]}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[13px] text-ink/65">A/B/C test → v2 won at 92% confidence.</div>
          </div>

          {/* big editorial */}
          <a href="#" className="bento group relative col-span-12 row-span-2 overflow-hidden rounded-squircle md:col-span-5">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-emerald-200 to-teal-300" />
            <div className="absolute inset-0 opacity-50" style={{ background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.6), transparent 50%)' }} />
            <div className="relative flex h-full items-end justify-between p-6">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/65">Form&Co · editorial</div>
                <div className="text-[22px] font-semibold tracking-[-0.02em]">Quarterly journal, in print and pixels.</div>
              </div>
              <ArrowUR className="h-5 w-5 text-ink/65" />
            </div>
          </a>

          {/* tag tile */}
          <div className="bento col-span-12 row-span-1 overflow-hidden rounded-squircle bg-white hairline p-5 md:col-span-7">
            <div className="flex h-full items-center gap-3 overflow-x-auto">
              <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/45">Industries</span>
              {['Fashion', 'Architecture', 'SaaS', 'Photography', 'Cinema', 'Hospitality', 'Editorial', 'Wellness'].map(t => (
                <span key={t} className="shrink-0 rounded-full border border-ink/10 px-3 py-1.5 text-[12px] text-ink/70 hover:border-brand-500 hover:text-brand-700">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SparkLine() {
  const pts = [10, 18, 16, 26, 22, 36, 32, 48, 60, 72];
  const max = 80;
  const w = 280, h = 60;
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${(i/(pts.length-1))*w},${h - (p/max)*h}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full">
      <defs>
        <linearGradient id="sl" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#8259C5" stopOpacity="0.35" />
          <stop offset="1" stopColor="#8259C5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#sl)" />
      <path d={path} stroke="#5E309C" strokeWidth="2" fill="none" />
    </svg>
  );
}

/* ---------- CTA ---------- */
function CTA() {
  return (
    <section id="contact" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-ink via-brand-900 to-brand-800 p-10 text-white sm:p-16">
          <BMark className="absolute -right-20 -top-20 h-[420px] w-[420px]" opacity={0.12} />
          <div className="relative grid gap-10 md:grid-cols-2">
            <div>
              <Pill tone="light">Let's build something serious</Pill>
              <h3 className="mt-5 text-balance text-[44px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[60px]">
                Ready to stop<br />settling for<br /><span className="italic text-brand-300">generic?</span>
              </h3>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonPrimary data-cal-link="momcilo-brandlayer" data-cal-config='{"layout":"month_view"}' className="bg-white !text-ink hover:!bg-brand-100">Book a free call</ButtonPrimary>
                <ButtonGhost className="!bg-white/10 !text-white hairline-strong hover:!bg-white/15">hello@brandlayer.no</ButtonGhost>
              </div>
            </div>
            <div className="rounded-3xl bg-white/8 p-6 ring-1 ring-white/15 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-white/15 ring-1 ring-white/20">
                  <img src="assets/logo.png" alt="" className="h-7 w-7 object-contain" />
                </div>
                <div>
                  <div className="text-[14px] font-semibold">Quick 15-minute intro call</div>
                  <div className="text-[12px] text-white/55">Mon–Thu · 9:00–18:00 CET · with Joseph</div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-7 gap-1.5">
                {Array.from({ length: 21 }).map((_, i) => {
                  const active = [3, 6, 8, 12, 15, 17, 19].includes(i);
                  const taken = [0, 4, 10, 13].includes(i);
                  return (
                    <button key={i} className={
                      "aspect-square rounded-md text-[11px] font-medium transition " +
                      (active ? "bg-white text-ink ring-1 ring-white" :
                       taken ? "bg-white/5 text-white/30 line-through" :
                       "bg-white/10 text-white/70 hover:bg-white/20")
                    }>{i + 8}</button>
                  );
                })}
              </div>
              <div className="mt-5 flex items-center justify-between rounded-xl bg-black/30 px-3 py-2.5 text-[12px]">
                <span className="text-white/60">Tue, May 12 · 14:00</span>
                <span className="rounded-full bg-brand-400 px-2.5 py-1 text-ink">Hold slot</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  const cols = [
    { t: 'Studio', l: ['About', 'Process', 'Careers', 'Press'] },
    { t: 'Work', l: ['Selected', 'Archive', 'Case studies', 'Awards'] },
    { t: 'Services', l: ['Portfolio', 'Conversion', 'E-commerce', 'Care plans'] },
    { t: 'Contact', l: ['formatxofficial@gmail.com', 'Berlin · Lisbon', 'Instagram', 'Read.cv'] },
  ];
  return (
    <footer className="relative bg-ink text-white footer-cut">
      <div className="mx-auto max-w-7xl px-6 pb-0 pt-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <img src="assets/logo.png" alt="" className="h-10 w-10 object-contain" />
              <span className="text-[20px] font-semibold tracking-[-0.02em]">Brand Layer</span>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-white/65">
              A small studio in Berlin & Lisbon. We design and build a handful of websites a year — for people who care about the difference.
            </p>
            <div className="mt-6 flex items-center gap-3 text-[13px] text-white/55">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Booking 2 projects for Q3 · 2026
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4">
            {cols.map(c => (
              <div key={c.t}>
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/40">{c.t}</div>
                <ul className="mt-4 space-y-2.5 text-[14px]">
                  {c.l.map(li => <li key={li}><a href="#" className="text-white/75 hover:text-white">{li}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-[12px] text-white/50">
          <span>© 2026 Brand Layer Studio. All work, all our own.</span>
          <span className="font-mono">v1.4.0 · last deployed today</span>
        </div>
      </div>

      {/* Cropped footer wordmark */}
      <div className="relative h-[clamp(104px,14vw,220px)] overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-6">
          <div
            className="flex items-start justify-between gap-[clamp(2rem,8vw,8rem)] whitespace-nowrap leading-[0.78] tracking-[-0.05em] font-bold text-white select-none"
            style={{ fontSize: 'clamp(120px, 28vw, 460px)' }}
            aria-label="BRAND L"
          >
            <span>BRAND</span>
            <span className="shrink-0">L</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Hero, TrustedMarquee, Services, Process, Work, CTA, Footer });
