"use client";

export default function Disclaimer() {
  return (
    <div className="bg-[rgba(0,0,0,0.4)] backdrop-blur-sm border-b border-[var(--card-border)] text-[var(--foreground-muted)] text-xs px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
        <span>
          Based on a{" "}
          <a
            href="https://x.com/MelMattison1/status/2011125076004127076"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--bitcoin)] hover:text-[var(--bitcoin-light)] underline transition-colors"
          >
            tweet by Mel Mattison
          </a>
          {" "}&mdash; not endorsed by him.
        </span>
        <span className="text-[var(--card-border-highlight)]">|</span>
        <span className="text-[var(--gold)] font-medium">
          Not financial advice. For educational purposes only.
        </span>
      </div>
    </div>
  );
}
