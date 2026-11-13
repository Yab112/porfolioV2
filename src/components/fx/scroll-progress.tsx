"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Flat green bar pinned to the top edge; doubles as a reading-progress bar on posts. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX, background: "var(--green-fill)" }}
      className="fixed inset-x-0 top-0 z-[70] h-1 origin-left"
    />
  );
}
