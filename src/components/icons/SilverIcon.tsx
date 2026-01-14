interface SilverIconProps {
  size?: number;
  className?: string;
}

export default function SilverIcon({ size = 24, className = "" }: SilverIconProps) {
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
        <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8E8E8" />
          <stop offset="50%" stopColor="#C0C0C0" />
          <stop offset="100%" stopColor="#A8A8A8" />
        </linearGradient>
        <linearGradient id="silverShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F5F5F5" />
          <stop offset="50%" stopColor="#E0E0E0" />
          <stop offset="100%" stopColor="#BDBDBD" />
        </linearGradient>
      </defs>
      {/* Silver bar base */}
      <path
        d="M4 18L6 8H18L20 18H4Z"
        fill="url(#silverGradient)"
        stroke="#9E9E9E"
        strokeWidth="0.5"
      />
      {/* Top face */}
      <path
        d="M6 8L8 6H16L18 8H6Z"
        fill="url(#silverShine)"
        stroke="#9E9E9E"
        strokeWidth="0.5"
      />
      {/* Right face shadow */}
      <path
        d="M18 8L20 18H20L18 18V8Z"
        fill="#9E9E9E"
        opacity="0.6"
      />
      {/* Shine line */}
      <path
        d="M7 12L9 10"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
