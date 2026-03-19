"use client";

import { GraduationCap } from "lucide-react";
import { useState } from "react";

export function EducationLogo({ logoUrl }: { logoUrl: string }) {
  const [error, setError] = useState(false);
  if (!logoUrl || error) {
    return (
      <div className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] shrink-0 overflow-hidden flex items-center justify-center rounded-lg bg-muted/50">
        <GraduationCap className="size-5 text-muted-foreground" aria-hidden />
      </div>
    );
  }
  return (
    <div className="w-24 h-24 min-w-[2.5rem] min-h-[2.5rem] shrink-0 overflow-hidden flex items-center justify-center rounded-lg bg-muted/50">
      <img
        src={logoUrl}
        alt=""
        className="w-full h-full max-w-full max-h-full object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
}
