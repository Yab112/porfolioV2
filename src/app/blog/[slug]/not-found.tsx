import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <main className="min-h-[40vh] py-16 text-center">
      <h1 className="text-xl font-semibold">Post not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">That slug does not match a published post.</p>
      <Link href="/blog" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
        ← Back to blog
      </Link>
    </main>
  );
}
