import type { ReactNode } from "react";

/** Long-form legal/editorial column. Narrow measure, generous rhythm. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="canvas">
      <div className="flex max-w-[68ch] flex-col gap-6 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-8 [&_h2]:text-[var(--text-default)] [&_li]:text-[var(--text-neutral)] [&_p]:text-[var(--text-neutral)] [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}
