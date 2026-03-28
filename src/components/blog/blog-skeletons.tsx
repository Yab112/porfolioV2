import { cn } from "@/lib/utils";

function Bar({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function BlogListSkeleton() {
  return (
    <main
      className="min-h-dvh pb-8"
      aria-busy="true"
      aria-label="Loading blog posts"
    >
      <header className="relative overflow-hidden rounded-3xl border border-border">
        <div
          className="absolute inset-0 opacity-[0.07] dark:opacity-[0.06] bg-repeat bg-[length:280px] bg-pattern-light dark:bg-pattern-dark"
          aria-hidden
        />
        <div className="relative space-y-3 px-6 py-10 sm:px-10 sm:py-12">
          <Bar className="h-3 w-20" />
          <Bar className="h-8 w-36 max-w-[60%]" />
          <Bar className="h-4 w-full max-w-xl" />
          <Bar className="h-4 max-w-lg w-[85%]" />
        </div>
      </header>

      <ul className="mt-10 flex flex-col gap-4">
        {Array.from({ length: 5 }, (_, i) => (
          <li
            key={i}
            className="rounded-xl border border-border bg-card/40 p-5 dark:bg-card/30"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-6">
              <Bar className="aspect-[16/10] w-full shrink-0 rounded-lg sm:aspect-auto sm:h-28 sm:w-40" />
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Bar className="h-3 w-28" />
                  <Bar className="h-3 w-20" />
                </div>
                <Bar className="h-5 w-4/5 max-w-md" />
                <Bar className="h-4 w-full" />
                <Bar className="h-4 w-11/12" />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Bar className="h-5 w-14 rounded-md" />
                  <Bar className="h-5 w-16 rounded-md" />
                </div>
              </div>
              <Bar className="h-5 w-16 shrink-0 self-start sm:self-center" />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export function BlogPostSkeleton() {
  return (
    <main
      className="min-h-dvh pb-12"
      aria-busy="true"
      aria-label="Loading article"
    >
      <Bar className="h-4 w-28" />

      <div className="mt-8 space-y-4 border-b border-border/80 pb-8">
        <div className="flex flex-wrap gap-3">
          <Bar className="h-3 w-36" />
          <Bar className="h-3 w-24" />
        </div>
        <Bar className="h-10 w-full max-w-2xl" />
        <Bar className="h-4 w-full max-w-xl" />
        <Bar className="h-4 max-w-lg w-[90%]" />
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Bar className="h-5 w-16 rounded-md" />
          <Bar className="h-5 w-20 rounded-md" />
        </div>
      </div>

      <Bar className="mt-8 h-48 w-full max-w-[52rem] rounded-2xl" />

      <div className="mx-auto max-w-[52rem] space-y-3 pt-8">
        {Array.from({ length: 10 }, (_, i) => (
          <Bar
            key={i}
            className={cn(
              "h-4",
              i % 4 === 0 && "w-full",
              i % 4 === 1 && "w-[92%]",
              i % 4 === 2 && "w-[88%]",
              i % 4 === 3 && "w-full"
            )}
          />
        ))}
      </div>
    </main>
  );
}
