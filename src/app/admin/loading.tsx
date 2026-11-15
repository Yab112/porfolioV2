import { Loading } from "./_lib";

/** Shown while moving between admin pages. */
export default function AdminLoading() {
  return (
    <main className="space-y-8">
      <div className="space-y-3 border-b border-border pb-4">
        <div className="h-9 w-48 animate-pulse bg-muted" />
        <div className="h-3.5 w-80 max-w-full animate-pulse bg-muted/60" />
      </div>
      <Loading rows={6} />
    </main>
  );
}
