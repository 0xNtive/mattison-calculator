interface GoldIconProps {
  size?: number;
  className?: string;
}

export default function GoldIcon({ size = 24, className = "" }: GoldIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFC107" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFE44D" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#DAA520" />
        </linearGradient>
      </defs>
      {/* Gold bar base */}
      <path
        d="M4 18L6 8H18L20 18H4Z"
        fill="url(#goldGradient)"
        stroke="#B8860B"
        strokeWidth="0.5"
      />
      {/* Top face */}
      <path
        d="M6 8L8 6H16L18 8H6Z"
        fill="url(#goldShine)"
        stroke="#B8860B"
        strokeWidth="0.5"
      />
      {/* Right face shadow */}
      <path
        d="M18 8L20 18H20L18 18V8Z"
        fill="#DAA520"
        opacity="0.6"
      />
      {/* Shine line */}
      <path
        d="M7 12L9 10"
        stroke="#FFE44D"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
