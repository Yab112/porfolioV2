import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import Link from "next/link";

const site = DATA.url.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${DATA.name} handles information on this portfolio site, including the contact form and chat assistant.`,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `Privacy | ${DATA.name}`,
    description: `Privacy information for ${DATA.url}`,
    url: `${site}/privacy`,
    siteName: DATA.name,
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh pb-8">
      <h1 className="text-3xl font-bold tracking-tight">Privacy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date())}
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-foreground/90">
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Overview</h2>
          <p className="text-muted-foreground">
            This page describes how information is handled when you use this personal portfolio website (
            <a href={DATA.url} className="text-primary underline-offset-4 hover:underline">
              {DATA.url.replace(/^https?:\/\//, "")}
            </a>
            ). It is provided for transparency; it is not legal advice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">What this site collects</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground/90">Contact form.</strong> If you send a message, your email address and message text are submitted to process your request. Delivery is handled by an email provider (e.g. Resend) to reach {DATA.contact.email}.
            </li>
            <li>
              <strong className="text-foreground/90">Chat assistant.</strong> Messages you send in the on-site chat are sent to this site&apos;s server and then to an external assistant API to generate replies. A session identifier may be stored in your browser (
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">localStorage</code>
              ) so the conversation can stay consistent across page loads.
            </li>
            <li>
              <strong className="text-foreground/90">Blog.</strong> Reading posts does not require an account. Content may be loaded from a third-party API or CDN as part of normal operation.
            </li>
            <li>
              <strong className="text-foreground/90">Hosting &amp; logs.</strong> Like most sites, the host (e.g. Vercel) may process technical data such as IP address, request metadata, and timestamps for security and reliability.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Cookies &amp; local storage</h2>
          <p className="text-muted-foreground">
            Theme preference may be stored locally so light/dark mode persists. The chat feature may store a session id in{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">localStorage</code>. There are no advertising cookies on this site by default.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Third-party services</h2>
          <p className="text-muted-foreground">
            Depending on configuration, data may be processed by infrastructure and service providers (for example: site hosting, email delivery, and the assistant API used by chat). Those providers operate under their own terms and privacy policies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Retention</h2>
          <p className="text-muted-foreground">
            Retention of messages, logs, and backups depends on the hosting and API providers in use. This site does not sell your personal information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Your choices</h2>
          <p className="text-muted-foreground">
            You can avoid the contact form and chat if you do not want to send that data. You can clear site data in your browser settings to remove locally stored preferences or chat session ids.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Contact</h2>
          <p className="text-muted-foreground">
            Questions about this policy:{" "}
            <a href={`mailto:${DATA.contact.email}`} className="text-primary underline-offset-4 hover:underline">
              {DATA.contact.email}
            </a>
            .
          </p>
        </section>

        <p className="pt-4">
          <Link href="/" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
