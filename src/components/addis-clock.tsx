"use client";

import { useEffect, useState } from "react";

/** Current time in Addis Ababa (EAT, UTC+3), rendered after mount to avoid hydration drift. */
export function AddisClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Addis_Ababa",
      hour: "2-digit",
      minute: "2-digit",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time ?? "--:--"} EAT</span>;
}
