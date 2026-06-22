/**
 * Bite-sized “I learned this the hard way” notes. Shown on the home page:
 * one entry per calendar day (local), plus a shuffle for repeat visits.
 */
export type DailyLesson = {
  /** Short label for the vibe of the mistake */
  flavor: "shipping" | "systems" | "people" | "ego" | "tools";
  /** One or two sentences, first person, past tense → present habit */
  text: string;
};

export const DAILY_LESSONS: DailyLesson[] = [
  {
    flavor: "shipping",
    text:
      "I once treated a Friday deploy as ‘just a small config tweak’ with no rollback story. The weekend re-taught me that ‘small’ and ‘safe’ are different words. Now Fridays respect blast radius.",
  },
  {
    flavor: "systems",
    text:
      "Past me loved optimizing queries I hadn’t measured yet. These days I log first, prove the pain, then buy performance with real numbers—not vibes.",
  },
  {
    flavor: "ego",
    text:
      "I used to skip tests when I was ‘in the zone’. The zone lied; prod didn’t. Tests are how I stay honest when confidence feels free.",
  },
  {
    flavor: "people",
    text:
      "I assumed stakeholders read the doc if I linked it once. They were busy; I was naive. A one-line summary beats a perfect PDF nobody opens.",
  },
  {
    flavor: "tools",
    text:
      "I’ve nuked calm afternoons with a cheerful `git push --force` on shared branches. Branches are multiplayer; I treat shared history like glassware now.",
  },
  {
    flavor: "shipping",
    text:
      "I shipped ‘one more feature’ before fixing onboarding friction. Users don’t applaud features they never reach—clarity beats breadth on week one.",
  },
  {
    flavor: "systems",
    text:
      "I learned that retries without backoff are just polite DDoS machines aimed at myself. Backoff, jitter, idempotency—boring words, quiet weekends.",
  },
  {
    flavor: "ego",
    text:
      "I used to debate architecture in my head for days instead of sketching a box diagram for twenty minutes. Paper is cheaper than rewrite season.",
  },
  {
    flavor: "people",
    text:
      "I once waited too long to say ‘this timeline is fiction’. Silence felt kind; it wasn’t. Early honesty is respect, not pessimism.",
  },
  {
    flavor: "tools",
    text:
      "I trusted env var names from memory across environments once. One typo taught me that ‘works on my machine’ should never be the only oracle.",
  },
  {
    flavor: "systems",
    text:
      "I treated caching as free speed until stale data embarrassed me in front of users. Cache is a contract: who invalidates, when, and how loudly.",
  },
  {
    flavor: "shipping",
    text:
      "I merged without a rollback checklist because the release felt easy. Easy releases are exactly when the weird edge cases throw a party.",
  },
  {
    flavor: "ego",
    text:
      "I’ve defended my code like it was my pet. Code isn’t identity; it’s inventory. Review comments are edits, not attacks.",
  },
  {
    flavor: "people",
    text:
      "I wrote long Slack threads instead of a 5‑minute call. Sometimes async is efficient; sometimes it’s procrastination in a trench coat.",
  },
  {
    flavor: "tools",
    text:
      "I copied a regex from Stack Overflow without a test case. I won’t describe what broke; therapy helped. Regex gets tests now.",
  },
  {
    flavor: "systems",
    text:
      "I ignored observability because the MVP ‘wasn’t ready for metrics yet’. Prod was ready for incidents; logs arrived one panic too late.",
  },
  {
    flavor: "shipping",
    text:
      "I said yes to scope creep because saying no felt rude. Boundaries aren’t rudeness—they’re how quality survives contact with reality.",
  },
  {
    flavor: "ego",
    text:
      "I compared my chapter one to someone else’s chapter twelve. Useful for humility; useless for planning. Run your own race with your own constraints.",
  },
];

const FLAVOR_LABEL: Record<DailyLesson["flavor"], string> = {
  shipping: "Shipping",
  systems: "Systems",
  people: "People",
  ego: "Mindset",
  tools: "Tooling",
};

export function lessonFlavorLabel(flavor: DailyLesson["flavor"]): string {
  return FLAVOR_LABEL[flavor];
}

/** Stable index for a given local calendar day. */
export function indexForLocalDay(date: Date, length: number): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const key = `${y}-${m}-${d}`;
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % length;
}

export function randomLessonIndex(exclude: number, length: number): number {
  if (length <= 1) return 0;
  let next = exclude;
  while (next === exclude) {
    next = Math.floor(Math.random() * length);
  }
  return next;
}
