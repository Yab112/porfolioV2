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
import { Send } from "lucide-react";
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

  return (
    <div className="border rounded-xl p-10 relative overflow-hidden pt-12">
      <div className="absolute inset-0 top-0 left-0 right-0 h-1/2 rounded-xl overflow-hidden pointer-events-none">
        <FlickeringGrid
          className="h-full w-full"
          squareSize={2}
          gridGap={2}
          style={{
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </div>
      <div className="relative flex flex-col items-center gap-6 text-center">
        <div className="space-y-3 max-w-lg mx-auto">
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Get in touch</h2>
            <p className="text-muted-foreground text-balance text-sm leading-relaxed">
              {DATA.contact.contactFormIntro}
            </p>
          </div>
          <p className="text-muted-foreground text-balance text-sm leading-relaxed">
            {DATA.contact.contactFormUpworkNote}{" "}
            <Link
              href={DATA.contact.upworkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              Open my Upwork profile
            </Link>
            .
          </p>
          <p className="text-muted-foreground/90 text-balance text-xs leading-relaxed">
            You can also use the form below to email me directly.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md flex flex-col gap-4 text-left"
        >
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
          <div className="space-y-2">
            <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
              Message
            </label>
            <textarea
              id="contact-message"
              placeholder="Your message..."
              rows={5}
              className={cn(
                "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 resize-y min-h-[120px]",
                errors.text && "border-destructive focus:ring-destructive"
              )}
              {...register("text")}
            />
            {errors.text && (
              <p className="text-xs text-destructive">{errors.text.message}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto gap-2"
          >
            {isLoading ? "Sending..." : "Send message"}
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
