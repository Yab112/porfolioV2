"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * One cache for the whole admin, kept for the life of the tab.
 *
 * A page you have opened before shows its last data at once and refreshes in the
 * background; the skeleton appears only the very first time something is loaded.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15_000, // within 15s a revisit does not even refetch
      gcTime: 60 * 60 * 1000, // keep unused pages cached for an hour
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

export const queryKey = (path: string) => ["admin", path] as const;

export function AdminQueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
