interface PlatinumIconProps {
  size?: number;
  className?: string;
}

export default function PlatinumIcon({ size = 24, className = "" }: PlatinumIconProps) {
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
        <linearGradient id="platinumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E5E4E2" />
          <stop offset="50%" stopColor="#D4D4D4" />
          <stop offset="100%" stopColor="#B0B0B0" />
        </linearGradient>
        <linearGradient id="platinumShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F8F8F8" />
          <stop offset="50%" stopColor="#E8E8E8" />
          <stop offset="100%" stopColor="#CACACA" />
        </linearGradient>
      </defs>
      {/* Platinum coin */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="url(#platinumGradient)"
        stroke="#A0A0A0"
        strokeWidth="0.5"
      />
      {/* Inner ring */}
      <circle
        cx="12"
        cy="12"
        r="7"
        fill="none"
        stroke="url(#platinumShine)"
        strokeWidth="1"
      />
      {/* Pt symbol */}
      <text
        x="12"
        y="14"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#666666"
        fontFamily="system-ui, sans-serif"
      >
        Pt
      </text>
      {/* Shine highlight */}
      <ellipse
        cx="9"
        cy="8"
        rx="3"
        ry="1.5"
        fill="white"
        opacity="0.4"
      />
    </svg>
  );
}
