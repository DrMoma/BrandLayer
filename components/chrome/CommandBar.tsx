"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { site } from "@/content/site";
import { searchItems, type SearchItem } from "@/lib/search";
import { cn } from "@/lib/cn";

/**
 * THE COMMAND BAR
 *
 * Primary navigation on every breakpoint, floating 60px off the bottom.
 * Doubles as a search palette (Cmd/Ctrl-K) over brands, the approach, pages and
 * booking. It is a combobox, wired properly: aria-expanded, aria-activedescendant,
 * arrow keys, Enter, Escape, click-outside.
 *
 * On mobile the same pill carries the menu, so there is no separate hamburger
 * and no second navigation model to maintain.
 */
export function CommandBar() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"search" | "menu">("search");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const results = useMemo(() => searchItems(query), [query]);
  const showResults = mode === "search" && query.trim().length > 0;

  const close = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  const openWith = (next: "search" | "menu") => {
    setMode(next);
    setOpen(true);
    if (next === "search") requestAnimationFrame(() => inputRef.current?.focus());
  };

  // Close on route change — the destination is the confirmation.
  useEffect(() => {
    close();
  }, [pathname]);

  // Cmd/Ctrl-K anywhere, Escape to dismiss.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openWith("search");
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Click outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [open]);

  const go = (item: SearchItem) => {
    close();
    if (item.href.startsWith("mailto:")) window.location.href = item.href;
    else router.push(item.href);
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) go(item);
    }
  };

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-x-0 bottom-[max(24px,env(safe-area-inset-bottom))] z-40 flex justify-center px-[var(--page-margin)] tablet:bottom-[60px]"
    >
      <div className="pointer-events-auto flex w-full max-w-[420px] tablet:max-w-[680px] flex-col items-stretch gap-2">
        {/* Panel rises above the bar. */}
        <div
          id="cmd-panel"
          role={showResults ? "listbox" : undefined}
          aria-label={showResults ? "Search results" : "Menu"}
          hidden={!open || (mode === "search" && !showResults)}
          className={cn(
            "overflow-hidden rounded-[24px] border border-[var(--stroke-soft)]",
            "bg-[color-mix(in_srgb,var(--bg-default)_82%,transparent)] backdrop-blur-md",
            "shadow-[0_24px_80px_-24px_rgb(42_38_34/0.28)]",
            "origin-bottom transition-[opacity,transform] duration-300 ease-[var(--ease-house)]",
            open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
          )}
        >
          {showResults ? (
            results.length ? (
              <ul className="p-2">
                {results.map((item, i) => (
                  <li key={item.id}>
                    <button
                      id={`cmd-opt-${i}`}
                      role="option"
                      aria-selected={i === active}
                      onPointerEnter={() => setActive(i)}
                      onClick={() => go(item)}
                      className={cn(
                        "flex w-full items-baseline gap-3 rounded-[16px] px-3 py-2.5 text-left transition-colors duration-150",
                        i === active ? "bg-[var(--scrim)]" : "bg-transparent"
                      )}
                    >
                      <span className="type-label shrink-0 text-[var(--text-faint)]">
                        {item.group}
                      </span>
                      <span className="type-body min-w-0 flex-1 truncate text-[var(--text-default)]">
                        {item.label}
                      </span>
                      {item.hint && (
                        <span className="type-label hidden shrink-0 truncate text-[var(--text-faint)] tablet:block">
                          {item.hint}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="type-body px-5 py-4 text-[var(--text-neutral)]">
                Nothing matches “{query.trim()}”.
              </p>
            )
          ) : (
            <nav className="p-2" aria-label="Primary">
              {site.nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="type-h6 block rounded-[16px] px-4 py-3 transition-colors duration-150 hover:bg-[var(--scrim)]"
                >
                  {n.label}
                </Link>
              ))}
              <a
                href={`mailto:${site.email}`}
                className="type-label block rounded-[16px] px-4 py-3 text-[var(--text-neutral)] transition-colors duration-150 hover:bg-[var(--scrim)]"
              >
                {site.email}
              </a>
            </nav>
          )}
        </div>

        {/* The bar itself. */}
        <div
          className={cn(
            "flex items-center gap-1 rounded-full border border-[var(--stroke-soft)] p-1.5",
            "bg-[color-mix(in_srgb,var(--bg-default)_78%,transparent)] backdrop-blur-md",
            "shadow-[0_16px_50px_-20px_rgb(42_38_34/0.3)]",
            "transition-[border-color,box-shadow] duration-300",
            open && mode === "search" && "border-[var(--accent)]"
          )}
        >
          <label htmlFor="cmd-input" className="sr-only">
            Search Brand Layer
          </label>
          <input
            id="cmd-input"
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={open && showResults}
            aria-controls="cmd-panel"
            aria-autocomplete="list"
            aria-activedescendant={showResults && results.length ? `cmd-opt-${active}` : undefined}
            autoComplete="off"
            spellCheck={false}
            placeholder="Ask Brand Layer"
            value={query}
            onFocus={() => openWith("search")}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
              setMode("search");
              setOpen(true);
            }}
            onKeyDown={onInputKey}
            className={cn(
              "type-nav min-w-0 flex-1 bg-transparent px-3.5 py-2 text-[var(--text-default)]",
              "placeholder:text-[var(--text-neutral)] focus:outline-none"
            )}
          />

          {/* Desktop: links live inline. */}
          <nav aria-label="Primary" className="hidden shrink-0 items-center tablet:flex">
            {site.nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={pathname === n.href ? "page" : undefined}
                className={cn(
                  "type-nav rounded-full px-3 py-2 transition-colors duration-150",
                  "hover:bg-[var(--scrim)]",
                  pathname === n.href ? "text-[var(--text-default)]" : "text-[var(--text-neutral)]"
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Mobile: one button, same panel. */}
          <button
            type="button"
            aria-expanded={open && mode === "menu"}
            aria-controls="cmd-panel"
            aria-label={open && mode === "menu" ? "Close menu" : "Open menu"}
            onClick={() => (open && mode === "menu" ? close() : openWith("menu"))}
            className="grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-150 hover:bg-[var(--scrim)] tablet:hidden"
          >
            <span className="relative block h-[9px] w-[15px]">
              <span
                className={cn(
                  "absolute inset-x-0 top-0 h-[1.5px] bg-current transition-transform duration-300 ease-[var(--ease-house)]",
                  open && mode === "menu" && "translate-y-[3.75px] rotate-[26.565deg]"
                )}
              />
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-[1.5px] bg-current transition-transform duration-300 ease-[var(--ease-house)]",
                  open && mode === "menu" && "-translate-y-[3.75px] -rotate-[26.565deg]"
                )}
              />
            </span>
          </button>

          <kbd className="type-label mr-1 hidden shrink-0 rounded-full border border-[var(--stroke-soft)] px-2 py-1 text-[10px] text-[var(--text-faint)] desktop:block">
            ⌘K
          </kbd>
        </div>
      </div>
    </div>
  );
}
