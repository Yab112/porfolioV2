"use client";

import Link from "next/link";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { DATA } from "@/data/resume";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailValidator, type EmailRequestType } from "@/lib/validators/emailValidator";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Send, Github, Linkedin, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ContactSection() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<EmailRequestType>({
    resolver: zodResolver(EmailValidator),
    defaultValues: { text: "", email: "" },
  });

  async function onSubmit(data: EmailRequestType) {
    setIsLoading(true);
    axios
      .post("/api/sendEmail", data)
      .then(() => toast.success("Email sent successfully"))
      .catch(() => toast.error("Something went wrong"))
      .finally(() => {
        setIsLoading(false);
        reset();
      });
  }

  const c = DATA.contact;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border">
      {/* Subtle animated background at the top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40">
        <FlickeringGrid
          className="h-full w-full"
          squareSize={2}
          gridGap={2}
          style={{
            maskImage: "linear-gradient(to bottom, black 20%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent)",
          }}
        />
      </div>

      <div className="relative grid gap-10 p-8 sm:p-10 md:grid-cols-2 md:gap-16 lg:p-12">
        {/* Left — intro, links, Upwork callout */}
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
              Contact
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Let&apos;s work together
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {c.contactFormIntro}
            </p>
          </div>

          {/* Social / CV links */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={c.social.LinkedIn.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/50"
            >
              <Linkedin className="size-3.5 text-[#0077b5]" aria-hidden />
              LinkedIn
            </Link>
            <Link
              href={c.social.GitHub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/50"
            >
              <Github className="size-3.5" aria-hidden />
              GitHub
            </Link>
            <a
              href={c.resumePdfUrl}
              download
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/50"
            >
              <FileDown className="size-3.5" aria-hidden />
              Download CV
            </a>
          </div>

          {/* Upwork callout */}
          <div className="rounded-xl border border-border/70 bg-muted/30 p-5 space-y-3">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-primary/70">
              Top Rated · 100% Job Success
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {c.contactFormUpworkNote}
            </p>
            <Link
              href={c.upworkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Hire me on Upwork
            </Link>
          </div>
        </div>

        {/* Right — contact form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="space-y-2">
            <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder="your@email.com"
              className={cn(
                "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50",
                errors.email && "border-destructive focus:ring-destructive"
              )}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col flex-1 space-y-2">
            <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
              Message
            </label>
            <textarea
              id="contact-message"
              placeholder="Your message..."
              rows={6}
              className={cn(
                "w-full flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 resize-none min-h-[180px]",
                errors.text && "border-destructive focus:ring-destructive"
              )}
              {...register("text")}
            />
            {errors.text && (
              <p className="text-xs text-destructive">{errors.text.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="gap-2 self-start">
            {isLoading ? "Sending..." : "Send message"}
            <Send className="size-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
