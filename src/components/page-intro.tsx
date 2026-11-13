import type { ReactNode } from "react";

/** Opening block for an inner page: station number, poster title, one-paragraph lede. */
export function PageIntro({ index, title, children }: { index: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="space-y-6 pb-16 pt-8 lg:max-w-[62%] lg:pt-10">
      <p className="section-kicker">Station {index}</p>
      <h1 className="poster text-balance text-[clamp(3.5rem,11vw,9rem)]">{title}</h1>
      {children ? <div className="max-w-xl text-lg leading-relaxed text-muted-foreground">{children}</div> : null}
    </header>
  );
}
