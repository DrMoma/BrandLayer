"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { site } from "@/content/site";
import { Mark } from "@/components/chrome/Lockup";
import { Label } from "@/components/blocks/primitives";
import { cn } from "@/lib/cn";

type CalQueue = ((...args: unknown[]) => void) & {
  q?: IArguments[];
  ns?: Record<string, unknown>;
  loaded?: boolean;
};

/**
 * Cal's embed script expects window.Cal to already exist as a queue when it
 * runs — its own install snippet creates one first. Calls made here are
 * queued and replayed once the script arrives.
 */
function calQueue(): CalQueue {
  const w = window as unknown as { Cal?: CalQueue };
  if (w.Cal) return w.Cal;
  const cal: CalQueue = function () {
    // eslint-disable-next-line prefer-rest-params
    (cal.q ??= []).push(arguments);
  };
  cal.q = [];
  cal.ns = {};
  cal.loaded = true;
  w.Cal = cal;
  return cal;
}

const CAL_SCRIPT = "https://app.cal.com/embed/embed.js";
const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS_AHEAD = 2;

/** One line per weekday (Monday first) — the ticket talks back when you pick. */
const MOODS = [
  "Monday. Fresh week, fresh idea.",
  "Tuesday. Nobody's tired yet.",
  "Wednesday. Midweek is for big ideas.",
  "Thursday. Almost Friday, still sharp.",
  "Friday. End the week with a plan.",
  "Saturday. Weekend founders welcome.",
  "Sunday. Monday's plans start here.",
];

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const sameDay = (a: Date, b: Date) => iso(a) === iso(b);
const weekdayIndex = (d: Date) => (d.getDay() + 6) % 7; // Monday = 0

/**
 * BOOKING CALENDAR — a pitch ticket.
 *
 * A designed stand-in for the booking widget: it renders instantly, in the
 * site's own style, and only loads Cal.com when someone actually books. Picking
 * a date (or pressing Book) opens Cal.com's booking pop-up on that date. If
 * Cal.com can't load, the booking page opens in a new tab instead.
 *
 * Days lift onto a second plane on hover — the same two-layer move as the
 * mark — and the stub at the bottom tears off the ticket along a perforation.
 */
export function BookingCalendar() {
  // The grid depends on today's date, so it is built on the client only —
  // the page is static and would otherwise show the build day forever.
  const [today, setToday] = useState<Date | null>(null);
  const [month, setMonth] = useState(0); // offset from the current month
  const [selected, setSelected] = useState<Date | null>(null);
  const scriptState = useRef<"idle" | "loading" | "ready" | "failed">("idle");
  const stampId = useId();

  useEffect(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    setToday(now);
    setSelected(now);
  }, []);

  const loadCal = () => {
    if (scriptState.current !== "idle") return;
    scriptState.current = "loading";
    const cal = calQueue();
    cal("init", { origin: "https://app.cal.com" });
    const s = document.createElement("script");
    s.src = CAL_SCRIPT;
    s.async = true;
    s.onload = () => (scriptState.current = "ready");
    s.onerror = () => (scriptState.current = "failed");
    document.head.appendChild(s);
  };

  const book = (date: Date | null) => {
    const query = date ? `?date=${iso(date)}&month=${iso(date).slice(0, 7)}` : "";
    const link = `${site.booking.slug}${query}`;
    if (scriptState.current === "failed") {
      window.open(`https://cal.com/${link}`, "_blank", "noopener,noreferrer");
      return;
    }
    loadCal();
    calQueue()("modal", { calLink: link, config: { layout: "month_view", theme: "light" } });
  };

  const view = useMemo(() => {
    if (!today) return null;
    const first = new Date(today.getFullYear(), today.getMonth() + month, 1);
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => new Date(first.getFullYear(), first.getMonth(), i + 1));
    const title = first.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    return { lead: weekdayIndex(first), days, title };
  }, [today, month]);

  const stubDate = selected
    ? selected.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })
    : "Any day";

  return (
    <div onPointerEnter={loadCal} onFocusCapture={loadCal} className="cal-ticket relative w-full max-w-[26rem] desktop:max-w-none">
      {/* Spinning stamp — decoration only; the same facts are in the stub. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-10 z-10 size-[5.5rem] tablet:-right-10 tablet:size-24 desktop:right-8 desktop:-top-12 desktop:size-32"
      >
        <svg viewBox="0 0 100 100" className="cal-spin size-full">
          <defs>
            <path id={stampId} d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
          </defs>
          <circle cx="50" cy="50" r="49" fill="var(--text-default)" />
          <text
            fill="var(--bg-default)"
            fontSize="9.6"
            // 29 mono glyphs at 9.6 measure 159 units; the ring is 232.5.
            // Spacing of 2.5 closes the ring, trailing space included.
            letterSpacing="2.5"
            style={{ fontFamily: "var(--font-geist-mono), monospace", textTransform: "uppercase" }}
          >
            <textPath href={`#${stampId}`}>{"15 min · Free · Phone call · "}</textPath>
          </text>
        </svg>
        <div className="absolute inset-0 grid place-items-center text-[var(--bg-default)]">
          <Mark className="h-6 desktop:h-8" />
        </div>
      </div>

      {/* Up to 1280px: a tall ticket, stub torn off the bottom. Wider: the
          ticket fills the column beside the contact details, stub torn off
          the right-hand end. */}
      <div className="overflow-hidden rounded-[24px] border border-[var(--stroke-soft)] bg-[var(--bg-raised)] shadow-[0_24px_60px_-36px_rgb(20_20_20/0.35)] desktop:rounded-[32px] min-[1280px]:grid min-[1280px]:grid-cols-[minmax(0,1fr)_0_16rem]">
        {/* Ticket */}
        <div className="p-5 tablet:p-6 desktop:p-10">
          <div>
            <Label>15-min pitch call · With Momcilo</Label>
            <p className="type-h5 mt-3 pr-16 text-[var(--text-default)] desktop:mt-6 desktop:pr-0 desktop:text-[2.75rem] desktop:leading-[1.02]">
              Pick a day.
              <br />
              Bring the idea.
            </p>
            <p
              key={selected ? iso(selected) : "none"}
              className="cal-swap type-body mt-2 min-h-[1.5em] text-[var(--text-neutral)] desktop:mt-4"
              aria-live="polite"
            >
              {selected ? MOODS[weekdayIndex(selected)] : " "}
            </p>
          </div>

          <div>
            {/* Month navigation */}
            <div className="mt-6 flex items-center justify-between desktop:mt-8">
              <Label className="text-[var(--text-default)]">{view?.title ?? " "}</Label>
              <div className="flex gap-1">
                {[
                  { label: "Previous month", glyph: "←", to: month - 1, disabled: month === 0 },
                  { label: "Next month", glyph: "→", to: month + 1, disabled: month === MONTHS_AHEAD },
                ].map((b) => (
                  <button
                    key={b.label}
                    type="button"
                    aria-label={b.label}
                    disabled={b.disabled}
                    onClick={() => setMonth(b.to)}
                    className="grid size-8 place-items-center rounded-full border border-[var(--stroke-soft)] text-[var(--text-neutral)] transition-colors duration-200 hover:border-[var(--text-default)] hover:text-[var(--text-default)] disabled:pointer-events-none disabled:opacity-30 desktop:size-10"
                  >
                    <span aria-hidden="true">{b.glyph}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="mt-3 grid grid-cols-7 gap-y-1 desktop:mt-5 desktop:gap-y-2" role="grid" aria-label="Choose a date">
              {WEEKDAYS.map((d, i) => (
                <div key={i} className="type-label pb-1 text-center text-[var(--text-faint)]" aria-hidden="true">
                  {d}
                </div>
              ))}
              {view && Array.from({ length: view.lead }).map((_, i) => <div key={`lead-${i}`} aria-hidden="true" />)}
              {view && today
                ? view.days.map((d) => {
                    const past = d < today;
                    const isToday = sameDay(d, today);
                    const isSelected = selected ? sameDay(d, selected) : false;
                    return (
                      <div key={iso(d)} className="grid place-items-center">
                        <button
                          type="button"
                          disabled={past}
                          aria-pressed={isSelected}
                          aria-label={`Book ${d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}`}
                          onClick={() => {
                            setSelected(d);
                            book(d);
                          }}
                          className={cn(
                            "type-label relative grid size-9 place-items-center rounded-full text-[13px] tabular-nums tracking-normal transition-[translate,box-shadow,background-color,color] duration-200 ease-[var(--ease-expo)] desktop:size-12 desktop:text-[15px]",
                            past && "text-[var(--text-ghost)] line-through",
                            !past &&
                              !isSelected &&
                              "text-[var(--text-default)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[var(--bg-default)] hover:shadow-[3px_3px_0_0_var(--text-default)] hover:ring-1 hover:ring-[var(--text-default)]",
                            isSelected &&
                              "cal-pop -translate-x-0.5 -translate-y-0.5 bg-[var(--text-default)] text-[var(--bg-default)] shadow-[3px_3px_0_0_var(--stroke-firm)]"
                          )}
                        >
                          {d.getDate()}
                          {isToday && (
                            <span
                              aria-hidden="true"
                              className={cn(
                                "absolute bottom-1 size-1 rounded-full desktop:bottom-1.5",
                                isSelected ? "bg-[var(--bg-default)]" : "bg-[var(--text-default)]"
                              )}
                            />
                          )}
                        </button>
                      </div>
                    );
                  })
                : Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="grid place-items-center" aria-hidden="true">
                      <div className="size-9 rounded-full bg-[var(--bg-default)] desktop:size-12" />
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Perforation — horizontal on the tall ticket, vertical on the wide
            one, with a notch punched out of each end. */}
        <div className="relative" aria-hidden="true">
          <div className="mx-5 border-t-2 border-dashed border-[var(--stroke-soft)] desktop:mx-10 min-[1280px]:absolute min-[1280px]:inset-y-10 min-[1280px]:left-0 min-[1280px]:mx-0 min-[1280px]:border-t-0 min-[1280px]:border-l-2" />
          <span className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full border border-[var(--stroke-soft)] bg-[var(--bg-default)] desktop:-left-4 desktop:size-8 min-[1280px]:-top-4 min-[1280px]:left-px min-[1280px]:-translate-x-1/2 min-[1280px]:translate-y-0" />
          <span className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full border border-[var(--stroke-soft)] bg-[var(--bg-default)] desktop:-right-4 desktop:size-8 min-[1280px]:top-auto min-[1280px]:right-auto min-[1280px]:-bottom-4 min-[1280px]:left-px min-[1280px]:-translate-x-1/2 min-[1280px]:translate-y-0" />
        </div>

        {/* Stub */}
        <div className="flex items-center justify-between gap-4 p-5 tablet:px-6 desktop:px-10 desktop:py-7 min-[1280px]:flex-col min-[1280px]:items-stretch min-[1280px]:justify-end min-[1280px]:gap-8 min-[1280px]:p-10">
          <div className="min-w-0">
            <Label>Admit one founder</Label>
            <p className="mt-1 overflow-hidden min-[1280px]:mt-3">
              <span
                key={stubDate}
                className="cal-swap type-h6 block truncate text-[var(--text-default)] desktop:text-[1.5rem] min-[1280px]:text-[2rem] min-[1280px]:leading-[1.1]"
              >
                {stubDate}
              </span>
            </p>
            <p className="type-body mt-2 hidden text-[var(--text-neutral)] min-[1280px]:block">
              15 min · Phone call · Free
            </p>
          </div>
          <button
            type="button"
            onClick={() => book(selected)}
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--text-default)] px-5 py-3 text-[var(--bg-default)] transition-transform duration-200 ease-[var(--ease-expo)] hover:-rotate-2 hover:scale-[1.04] active:scale-95 desktop:px-7 desktop:py-4"
          >
            <span className="type-nav">Book</span>
            <span className="arrow-nudge" aria-hidden="true">
              ↘
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
