import { PageIntro } from "@/components/page-intro";
import ContactSection from "@/components/section/contact-section";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";

const description = "Contact Yabibal Eshetie Molla about a project, a role or a collaboration. Based in Addis Ababa, working worldwide.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: `Contact | ${DATA.name}`, description, url: `${DATA.url.replace(/\/$/, "")}/contact` },
};

export default function ContactPage() {
  return (
    <main>
      <PageIntro
        index="05"
        title={
          <>
            Say <span className="text-ink-purple">hello.</span>
          </>
        }
      >
        <p>{DATA.contact.contactFormIntro}</p>
      </PageIntro>
      <ContactSection />
    </main>
  );
}
