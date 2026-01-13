"use client";

export default function Disclaimer() {
  return (
    <div className="bg-slate-800 text-slate-300 text-xs px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
        <span>
          Based on a{" "}
          <a
            href="https://x.com/MelMattison1/status/2011125076004127076"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            tweet by Mel Mattison
          </a>
          {" "}&mdash; not endorsed by him.
        </span>
        <span className="text-slate-500">|</span>
        <span className="text-amber-400 font-medium">
          Not financial advice. For educational purposes only.
        </span>
      </div>
    </div>
  );
}
