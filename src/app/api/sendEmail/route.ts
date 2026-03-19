import { EmailValidator } from "@/lib/validators/emailValidator";
import { z } from "zod";

import { Resend } from "resend";
import { NextResponse } from "next/server";

/** Lazy init so `next build` does not run `new Resend()` when RESEND_API_KEY is unset. */
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function POST(req: Request) {
  try {
    const resend = getResend();
    if (!resend) {
      return NextResponse.json(
        { error: "Email service is not configured. Set RESEND_API_KEY." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { text, email } = EmailValidator.parse(body);
    await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "eshetieyabibal@gmail.com",
      subject: "Message from contact form",
      replyTo: email,
      text,
    });

    return new NextResponse("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 });
    }

    return new Response("Could not send email. Please try again later.", {
      status: 500,
    });
  }
}
