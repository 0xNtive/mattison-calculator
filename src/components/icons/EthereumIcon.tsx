interface EthereumIconProps {
  size?: number;
  className?: string;
}

export default function EthereumIcon({ size = 24, className = "" }: EthereumIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="12" fill="#627EEA" />
      <path
        d="M12 4L12 9.87L16.5 12.18L12 4Z"
        fill="white"
        fillOpacity="0.6"
      />
      <path
        d="M12 4L7.5 12.18L12 9.87L12 4Z"
        fill="white"
      />
      <path
        d="M12 16.22L12 20L16.5 13.07L12 16.22Z"
        fill="white"
        fillOpacity="0.6"
      />
      <path
        d="M12 20L12 16.22L7.5 13.07L12 20Z"
        fill="white"
      />
      <path
        d="M12 15.33L16.5 12.18L12 9.87L12 15.33Z"
        fill="white"
        fillOpacity="0.2"
      />
      <path
        d="M7.5 12.18L12 15.33L12 9.87L7.5 12.18Z"
        fill="white"
        fillOpacity="0.6"
      />
    </svg>
  );
}
