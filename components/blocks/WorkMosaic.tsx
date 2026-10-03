import Link from "next/link";
import { brands, type Brand } from "@/content/brands";
import { Frame, Label } from "@/components/blocks/primitives";
import { Reveal } from "@/components/motion/Reveal";
import { Value } from "@/components/case/CaseParts";

/**
 * BRAND MOSAIC
 *
 * A two-column feed, VSCO-style: each brand declares its column, row and frame
 * in content/brands.ts, so items stack within their column rather than lining
 * up in rows. One column below tablet, in content order.
 */
export function WorkMosaic({ items = brands }: { items?: readonly Brand[] }) {
  return (
    <div className="grid-canvas gap-y-[calc(var(--space-block)*1.25)]">
      {items.map((item, i) => (
        <article
          key={item.slug}
          className="col-span-full self-start tablet:[grid-column:var(--col)] tablet:[grid-row:var(--row)] tablet:[margin-top:var(--offset)]"
          style={
            {
              "--col": `${item.mosaic.start ?? "auto"} / span ${item.mosaic.span}`,
              "--row": item.mosaic.row ?? "auto",
              "--offset": item.mosaic.offsetY ?? "0px",
            } as React.CSSProperties
          }
        >
          <Link href={`/brands/${item.slug}`} className="group block" data-cursor="View">
            <Frame
              slot={item.media.key}
              aspect={item.mosaic.aspect}
              parallax={false}
              delay={(i % 2) * 90}
              className="w-full"
            />

            <div className="mt-5 flex flex-col gap-2">
              <Reveal delay={140}>
                <Label>
                  <Value value={item.category} /> · {item.year}
                </Label>
              </Reveal>
              <Reveal delay={200}>
                <h3 className="type-h5 text-[var(--text-default)]">
                  <span className="link-wipe">{item.name}</span>
                  <span className="arrow-nudge ml-[0.3em]" aria-hidden="true">
                    ↘
                  </span>
                </h3>
              </Reveal>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
