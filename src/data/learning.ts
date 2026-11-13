/**
 * What I am studying right now. Edit freely: add `certificateUrl` when a course
 * is finished and flip its status to "done".
 */
export type TrackStatus = "done" | "in-progress" | "next";

export interface LearningTrack {
  title: string;
  status: TrackStatus;
  platform: string;
  why: string;
  topics: string[];
  certificateUrl?: string;
}

export const LEARNING: {
  headline: string;
  intro: string;
  platform: string;
  tracks: LearningTrack[];
} = {
  headline: "Rebuilding the foundations, properly.",
  intro:
    "I ship LLM systems for a living. Now I am going back under the hood: a deliberate recap of the mathematics, the Python and the core machine learning ideas, then deep learning. I knew these before; this pass is about owning them.",
  platform: "Coursera",
  tracks: [
    {
      title: "Mathematics for machine learning",
      status: "in-progress",
      platform: "Coursera",
      why: "So a loss curve is something I can reason about, not just watch.",
      topics: ["Linear algebra", "Calculus", "Probability & statistics"],
    },
    {
      title: "Python for machine learning",
      status: "in-progress",
      platform: "Coursera",
      why: "The numerical stack, written by hand before reaching for a framework.",
      topics: ["NumPy", "Pandas", "Vectorised thinking"],
    },
    {
      title: "Machine learning concepts",
      status: "in-progress",
      platform: "Coursera",
      why: "The classical models and, more importantly, how to tell when one is wrong.",
      topics: ["Regression & classification", "Regularisation", "Evaluation"],
    },
    {
      title: "Deep learning",
      status: "next",
      platform: "Coursera",
      why: "Where the systems I deploy every day actually come from.",
      topics: ["Neural networks", "Optimisation", "Sequence models"],
    },
  ],
};
