/**
 * What I am studying right now. Edit freely: add `certificateUrl` when a course
 * is finished and flip its status to "done".
 */
export type TrackStatus = "done" | "in-progress" | "next";

export interface LearningTrack {
  title: string;
  status: TrackStatus;
  platform?: string;
  why: string;
  topics: string[];
  certificateUrl?: string;
}

export const LEARNING: {
  headline: string;
  intro: string;
  platform: string;
  tracks: LearningTrack[];
  /** Completed certificates, as listed on LinkedIn. */
  certificates: string[];
} = {
  headline: "Rebuilding the foundations, properly.",
  intro:
    "I ship LLM systems and design machine learning benchmarks for a living. Now I am strengthening what sits underneath: algebra, calculus, probability and statistics, and machine learning, with deep learning as the next focus. I want to understand how these systems are developed, evaluated and made reliable.",
  platform: "Coursera",
  tracks: [
    {
      title: "Algebra and calculus",
      status: "in-progress",
      why: "So a loss curve is something I can reason about, not just watch.",
      topics: ["Linear algebra", "Differential calculus"],
    },
    {
      title: "Probability and statistics",
      status: "in-progress",
      why: "Evaluation is statistics. I want to know when a result is real and when it is noise.",
      topics: ["Probability", "Statistics"],
    },
    {
      title: "Machine learning",
      status: "in-progress",
      why: "The classical models and, more importantly, how to tell when one is wrong.",
      topics: ["Core concepts", "Model evaluation"],
    },
    {
      title: "Python for data: NumPy and pandas",
      status: "done",
      why: "The numerical stack, written by hand before reaching for a framework.",
      topics: ["NumPy", "pandas"],
    },
    {
      title: "Deep learning",
      status: "next",
      why: "Where the systems I deploy every day actually come from.",
      topics: ["Neural networks"],
    },
  ],
  certificates: [
    "Algebra and Differential Calculus for Data Science",
    "Python NumPy Data Analysis for Data Scientist",
    "The Pandas Bootcamp: Data Analysis with pandas",
    "OOP Design Patterns in Python",
    "The Structured Query Language (SQL)",
  ],
};
