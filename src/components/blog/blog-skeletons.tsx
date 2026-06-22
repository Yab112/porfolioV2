import { cn } from "@/lib/utils";

function Bar({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function BlogListSkeleton() {
  return (
    <main
      className="min-h-dvh pb-16"
      aria-busy="true"
      aria-label="Loading blog posts"
    >
      {/* Header */}
      <div className="mb-10 space-y-2">
        <Bar className="h-3 w-16" />
        <Bar className="h-9 w-40 max-w-[60%]" />
        <Bar className="h-4 w-full max-w-md" />
      </div>

      {/* Topic filter pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        {["w-12", "w-16", "w-14", "w-20", "w-14"].map((w, i) => (
          <Bar key={i} className={`h-7 rounded-full ${w}`} />
        ))}
      </div>

      {/* Featured post */}
      <div className="mb-6 rounded-2xl overflow-hidden border border-border">
        <Bar className="w-full aspect-[21/9]" />
      </div>

      {/* Post grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-border bg-card/30">
            <Bar className="w-full aspect-[3/2]" />
            <div className="p-5 space-y-2.5">
              <Bar className="h-3 w-24" />
              <Bar className="h-5 w-full" />
              <Bar className="h-4 w-5/6" />
              <Bar className="h-3 w-28 mt-1" />
            </div>
          </div>
        ))}
      </div>
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
