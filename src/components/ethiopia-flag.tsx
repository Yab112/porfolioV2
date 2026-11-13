/** Flag of Ethiopia, drawn inline so it renders the same on every platform. */
export function EthiopiaFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 24"
      role="img"
      aria-label="Flag of Ethiopia"
      className={className ?? "inline-block h-[0.62em] w-auto align-baseline"}
    >
      <rect width="36" height="8" fill="#078930" />
      <rect y="8" width="36" height="8" fill="#fcdd09" />
      <rect y="16" width="36" height="8" fill="#da121a" />
      <circle cx="18" cy="12" r="6.2" fill="#0f47af" />
      <path
        d="M18 7.2l1.2 3.5h3.7l-3 2.2 1.1 3.5-3-2.2-3 2.2 1.1-3.5-3-2.2h3.7z"
        fill="none"
        stroke="#fcdd09"
        strokeWidth="0.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}
