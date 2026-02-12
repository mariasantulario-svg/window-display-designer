interface SvgProps {
  color?: string;
  size?: number;
  className?: string;
}

export function EggSvg({ color = "#FFB6C1", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <ellipse cx="30" cy="34" rx="16" ry="20" fill={color} stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 28c3-2 6 1 10-1s5-4 8-2" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
      <path d="M22 36c4 1 6-2 8-1s4 3 7 1" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
      <circle cx="26" cy="32" r="2" fill="#fff" opacity="0.5" />
    </svg>
  );
}

export function BunnySvg({ color = "#F5F5DC", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <ellipse cx="30" cy="38" rx="12" ry="14" fill={color} stroke="#333" strokeWidth="2.5" />
      <ellipse cx="24" cy="12" rx="5" ry="14" fill={color} stroke="#333" strokeWidth="2.5" />
      <ellipse cx="36" cy="12" rx="5" ry="14" fill={color} stroke="#333" strokeWidth="2.5" />
      <ellipse cx="24" cy="12" rx="3" ry="10" fill="#FFB6C1" opacity="0.5" />
      <ellipse cx="36" cy="12" rx="3" ry="10" fill="#FFB6C1" opacity="0.5" />
      <circle cx="26" cy="34" r="2" fill="#333" />
      <circle cx="34" cy="34" r="2" fill="#333" />
      <ellipse cx="30" cy="38" rx="2" ry="1.5" fill="#FFB6C1" />
      <path d="M28 40c1 1.5 3 1.5 4 0" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="22" cy="38" r="3" fill="#FFB6C1" opacity="0.3" />
      <circle cx="38" cy="38" r="3" fill="#FFB6C1" opacity="0.3" />
    </svg>
  );
}

export function FlowerSvg({ color = "#FFD700", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <line x1="30" y1="55" x2="30" y2="30" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 42c-5-2-10 0-12 3" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <ellipse
          key={angle}
          cx={30 + 10 * Math.cos((angle * Math.PI) / 180)}
          cy={22 + 10 * Math.sin((angle * Math.PI) / 180)}
          rx="7"
          ry="5"
          fill={color}
          stroke="#333"
          strokeWidth="2"
          transform={`rotate(${angle} ${30 + 10 * Math.cos((angle * Math.PI) / 180)} ${22 + 10 * Math.sin((angle * Math.PI) / 180)})`}
        />
      ))}
      <circle cx="30" cy="22" r="6" fill="#FF8C00" stroke="#333" strokeWidth="2" />
    </svg>
  );
}

export function BasketSvg({ color = "#DEB887", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <path d="M12 28h36l-4 22H16L12 28z" fill={color} stroke="#333" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M20 28c0-10 5-18 10-18s10 8 10 18" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <line x1="14" y1="34" x2="44" y2="34" stroke="#333" strokeWidth="1.5" />
      <line x1="15" y1="40" x2="43" y2="40" stroke="#333" strokeWidth="1.5" />
      <line x1="22" y1="28" x2="19" y2="50" stroke="#333" strokeWidth="1" />
      <line x1="30" y1="28" x2="30" y2="50" stroke="#333" strokeWidth="1" />
      <line x1="38" y1="28" x2="41" y2="50" stroke="#333" strokeWidth="1" />
    </svg>
  );
}

export function ChickSvg({ color = "#FFD700", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <ellipse cx="30" cy="36" rx="14" ry="16" fill={color} stroke="#333" strokeWidth="2.5" />
      <circle cx="30" cy="20" r="10" fill={color} stroke="#333" strokeWidth="2.5" />
      <circle cx="26" cy="18" r="2" fill="#333" />
      <circle cx="34" cy="18" r="2" fill="#333" />
      <polygon points="30,22 27,26 33,26" fill="#FF8C00" stroke="#333" strokeWidth="1.5" />
      <path d="M28 8c-2-4 0-6 2-5" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M32 8c2-4 0-6-2-5" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M18 42l-4 6" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 48l6 0" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M42 42l4 6" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 48l6 0" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function SaleSignSvg({ color = "#FF6B6B", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 50" className={className} fill="none">
      <rect x="4" y="4" width="72" height="36" rx="4" fill={color} stroke="#333" strokeWidth="2.5" />
      <rect x="4" y="4" width="72" height="36" rx="4" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="4 3" transform="translate(2,2) scale(0.94)" />
      <text x="40" y="28" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="18" fontWeight="bold" fill="#fff" stroke="#333" strokeWidth="0.5">SALE</text>
      <circle cx="12" cy="10" r="3" fill="#FFD700" stroke="#333" strokeWidth="1" />
      <circle cx="68" cy="10" r="3" fill="#FFD700" stroke="#333" strokeWidth="1" />
    </svg>
  );
}

export function ButterflySvg({ color = "#DDA0DD", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <ellipse cx="30" cy="30" rx="2" ry="12" fill="#333" stroke="#333" strokeWidth="1" />
      <ellipse cx="20" cy="24" rx="10" ry="12" fill={color} stroke="#333" strokeWidth="2.5" transform="rotate(-15 20 24)" />
      <ellipse cx="40" cy="24" rx="10" ry="12" fill={color} stroke="#333" strokeWidth="2.5" transform="rotate(15 40 24)" />
      <ellipse cx="22" cy="38" rx="7" ry="8" fill={color} stroke="#333" strokeWidth="2" opacity="0.8" transform="rotate(-10 22 38)" />
      <ellipse cx="38" cy="38" rx="7" ry="8" fill={color} stroke="#333" strokeWidth="2" opacity="0.8" transform="rotate(10 38 38)" />
      <circle cx="18" cy="22" r="3" fill="#fff" opacity="0.4" />
      <circle cx="42" cy="22" r="3" fill="#fff" opacity="0.4" />
      <path d="M28 18c-1-4-3-6-2-8" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 18c1-4 3-6 2-8" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="26" cy="10" r="1.5" fill="#333" />
      <circle cx="34" cy="10" r="1.5" fill="#333" />
    </svg>
  );
}

export function HeartSvg({ color = "#FF69B4", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <path d="M30 50C20 40 6 32 6 20c0-8 6-14 12-14 4 0 8 2 12 8 4-6 8-8 12-8 6 0 12 6 12 14 0 12-14 20-24 30z" fill={color} stroke="#333" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M20 16c-3 0-6 2-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function GiftSvg({ color = "#FF1493", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <rect x="10" y="22" width="40" height="30" rx="2" fill={color} stroke="#333" strokeWidth="2.5" />
      <rect x="8" y="18" width="44" height="8" rx="2" fill={color} stroke="#333" strokeWidth="2.5" />
      <line x1="30" y1="18" x2="30" y2="52" stroke="#FFD700" strokeWidth="4" />
      <line x1="8" y1="22" x2="52" y2="22" stroke="#FFD700" strokeWidth="4" />
      <path d="M30 18c-4-6-10-8-12-4s4 4 12 4" stroke="#FFD700" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M30 18c4-6 10-8 12-4s-4 4-12 4" stroke="#FFD700" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function PumpkinSvg({ color = "#FF8C00", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <ellipse cx="30" cy="36" rx="20" ry="18" fill={color} stroke="#333" strokeWidth="2.5" />
      <path d="M20 22c2-6 6-10 10-10s8 4 10 10" stroke="#4CAF50" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M30 22V12" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 36c0-10 3-18 6-18" stroke="#333" strokeWidth="1.5" opacity="0.3" />
      <path d="M46 36c0-10-3-18-6-18" stroke="#333" strokeWidth="1.5" opacity="0.3" />
      <path d="M30 22c0 10 0 18 0 28" stroke="#333" strokeWidth="1" opacity="0.2" />
      <polygon points="22,32 26,36 22,40" fill="#333" />
      <polygon points="38,32 34,36 38,40" fill="#333" />
      <path d="M24 44c2 2 4 3 6 3s4-1 6-3" stroke="#333" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function StarSvg({ color = "#FFD700", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <polygon points="30,6 36,22 54,22 40,34 44,50 30,40 16,50 20,34 6,22 24,22" fill={color} stroke="#333" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="24" y1="20" x2="28" y2="28" stroke="#fff" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
    </svg>
  );
}

export function SnowflakeSvg({ color = "#ADD8E6", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      {[0, 60, 120].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 30 30)`}>
          <line x1="30" y1="6" x2="30" y2="54" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="12" x2="22" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="12" x2="38" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="48" x2="22" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="48" x2="38" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      <circle cx="30" cy="30" r="4" fill={color} stroke="#333" strokeWidth="1.5" />
    </svg>
  );
}

export function TreeSvg({ color = "#228B22", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <rect x="26" y="48" width="8" height="8" fill="#8B4513" stroke="#333" strokeWidth="2" />
      <polygon points="30,4 48,28 38,28 50,44 10,44 22,28 12,28" fill={color} stroke="#333" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="24" cy="30" r="2.5" fill="#FF0000" stroke="#333" strokeWidth="1" />
      <circle cx="34" cy="24" r="2.5" fill="#FFD700" stroke="#333" strokeWidth="1" />
      <circle cx="28" cy="38" r="2.5" fill="#4169E1" stroke="#333" strokeWidth="1" />
      <circle cx="38" cy="36" r="2.5" fill="#FF69B4" stroke="#333" strokeWidth="1" />
      <polygon points="30,4 28,8 32,8" fill="#FFD700" stroke="#333" strokeWidth="1" />
    </svg>
  );
}

export function PresentSvg({ color = "#FF0000", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <rect x="12" y="24" width="36" height="28" rx="2" fill={color} stroke="#333" strokeWidth="2.5" />
      <rect x="10" y="20" width="40" height="8" rx="2" fill={color} stroke="#333" strokeWidth="2.5" />
      <line x1="30" y1="20" x2="30" y2="52" stroke="#fff" strokeWidth="3" />
      <line x1="10" y1="24" x2="50" y2="24" stroke="#fff" strokeWidth="3" />
      <path d="M30 20c-3-5-8-6-10-3s3 3 10 3" stroke="#228B22" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M30 20c3-5 8-6 10-3s-3 3-10 3" stroke="#228B22" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function BatSvg({ color = "#2F2F2F", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <ellipse cx="30" cy="30" rx="6" ry="8" fill={color} stroke="#333" strokeWidth="2" />
      <path d="M24 28C18 20 8 18 4 24c4-2 8 0 10 4 2-2 6-2 10 0z" fill={color} stroke="#333" strokeWidth="2" />
      <path d="M36 28C42 20 52 18 56 24c-4-2-8 0-10 4-2-2-6-2-10 0z" fill={color} stroke="#333" strokeWidth="2" />
      <circle cx="27" cy="28" r="2" fill="#FF0000" />
      <circle cx="33" cy="28" r="2" fill="#FF0000" />
      <path d="M26 20l-2-4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M34 20l2-4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function GhostSvg({ color = "#F5F5F5", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <path d="M14 54V28c0-10 7-18 16-18s16 8 16 18v26l-5-5-5 5-6-5-6 5-5-5-5 5z" fill={color} stroke="#333" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="24" cy="28" r="3" fill="#333" />
      <circle cx="36" cy="28" r="3" fill="#333" />
      <ellipse cx="30" cy="38" rx="4" ry="3" fill="#333" />
    </svg>
  );
}

export function SunSvg({ color = "#FFD700", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <circle cx="30" cy="30" r="12" fill={color} stroke="#333" strokeWidth="2.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1={30 + 16 * Math.cos((angle * Math.PI) / 180)}
          y1={30 + 16 * Math.sin((angle * Math.PI) / 180)}
          x2={30 + 24 * Math.cos((angle * Math.PI) / 180)}
          y2={30 + 24 * Math.sin((angle * Math.PI) / 180)}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      <circle cx="26" cy="28" r="1.5" fill="#333" />
      <circle cx="34" cy="28" r="1.5" fill="#333" />
      <path d="M26 34c2 2 6 2 8 0" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function PencilSvg({ color = "#FFD700", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <rect x="24" y="8" width="12" height="36" rx="1" fill={color} stroke="#333" strokeWidth="2.5" transform="rotate(10 30 30)" />
      <polygon points="24,44 30,54 36,44" fill="#FFF5E1" stroke="#333" strokeWidth="2" transform="rotate(10 30 30)" />
      <polygon points="28,50 30,56 32,50" fill="#333" transform="rotate(10 30 30)" />
      <rect x="24" y="8" width="12" height="6" rx="1" fill="#FF6347" stroke="#333" strokeWidth="2" transform="rotate(10 30 30)" />
    </svg>
  );
}

export function NotebookSvg({ color = "#4169E1", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <rect x="12" y="6" width="36" height="48" rx="3" fill={color} stroke="#333" strokeWidth="2.5" />
      <rect x="16" y="10" width="28" height="40" rx="1" fill="#fff" stroke="#333" strokeWidth="1" />
      <line x1="20" y1="18" x2="40" y2="18" stroke="#ADD8E6" strokeWidth="1" />
      <line x1="20" y1="24" x2="40" y2="24" stroke="#ADD8E6" strokeWidth="1" />
      <line x1="20" y1="30" x2="40" y2="30" stroke="#ADD8E6" strokeWidth="1" />
      <line x1="20" y1="36" x2="40" y2="36" stroke="#ADD8E6" strokeWidth="1" />
      <line x1="20" y1="42" x2="35" y2="42" stroke="#ADD8E6" strokeWidth="1" />
      <line x1="24" y1="10" x2="24" y2="50" stroke="#FF6347" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

export function BackpackSvg({ color = "#FF6347", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <rect x="14" y="16" width="32" height="36" rx="6" fill={color} stroke="#333" strokeWidth="2.5" />
      <path d="M22 16V10c0-4 3-6 8-6s8 2 8 6v6" stroke="#333" strokeWidth="2.5" fill="none" />
      <rect x="20" y="30" width="20" height="14" rx="2" fill="#fff" stroke="#333" strokeWidth="2" opacity="0.8" />
      <line x1="30" y1="30" x2="30" y2="44" stroke="#333" strokeWidth="1.5" />
    </svg>
  );
}

export function RoseSvg({ color = "#FF0000", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <line x1="30" y1="55" x2="30" y2="30" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 40c-4-1-8 1-10 4" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="22" r="12" fill={color} stroke="#333" strokeWidth="2.5" />
      <path d="M24 18c2-3 4-4 6-4s4 1 6 4c-2-1-4 0-6 2s-4 3-6 2c0-2 0-3 0-4z" fill="#CC0000" stroke="#333" strokeWidth="1" />
      <circle cx="27" cy="19" r="2" fill="#fff" opacity="0.3" />
    </svg>
  );
}

export function ShoppingBagSvg({ color = "#2F2F2F", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <rect x="12" y="20" width="36" height="34" rx="2" fill={color} stroke="#333" strokeWidth="2.5" />
      <path d="M20 20V14c0-6 4-10 10-10s10 4 10 10v6" stroke="#333" strokeWidth="2.5" fill="none" />
      <rect x="18" y="28" width="24" height="2" fill="#fff" opacity="0.3" />
    </svg>
  );
}

export function PriceTagSvg({ color = "#FF0000", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <path d="M10 30l18-20h22v22l-20 18z" fill={color} stroke="#333" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="40" cy="20" r="4" fill="#fff" stroke="#333" strokeWidth="1.5" />
      <text x="28" y="34" fontFamily="'Architects Daughter', cursive" fontSize="10" fill="#fff" fontWeight="bold">%</text>
    </svg>
  );
}

export function PercentSvg({ color = "#FFD700", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <circle cx="30" cy="30" r="22" fill={color} stroke="#333" strokeWidth="2.5" />
      <text x="30" y="38" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="24" fontWeight="bold" fill="#333">%</text>
    </svg>
  );
}

export function LeafSvg({ color = "#32CD32", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <path d="M30 50c0-20 16-36 20-40C46 14 30 10 20 20S10 44 30 50z" fill={color} stroke="#333" strokeWidth="2.5" />
      <path d="M30 50c0-16 8-28 14-34" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M30 36c4-4 8-6 10-6" stroke="#333" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M30 42c3-3 6-4 8-4" stroke="#333" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function IceCreamSvg({ color = "#FFB6C1", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <polygon points="22,30 38,30 30,56" fill="#DEB887" stroke="#333" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="25" y1="36" x2="35" y2="36" stroke="#333" strokeWidth="1" />
      <line x1="26" y1="42" x2="34" y2="42" stroke="#333" strokeWidth="1" />
      <circle cx="22" cy="22" r="10" fill={color} stroke="#333" strokeWidth="2.5" />
      <circle cx="38" cy="22" r="10" fill="#87CEEB" stroke="#333" strokeWidth="2.5" />
      <circle cx="30" cy="14" r="10" fill="#FFD700" stroke="#333" strokeWidth="2.5" />
      <circle cx="28" cy="12" r="2" fill="#fff" opacity="0.4" />
    </svg>
  );
}

export function CandyCaneSvg({ color = "#FF0000", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <path d="M34 12c0-6-4-8-8-8s-8 2-8 8" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
      <line x1="18" y1="12" x2="18" y2="54" stroke={color} strokeWidth="8" strokeLinecap="round" />
      <path d="M34 12c0-6-4-8-8-8s-8 2-8 8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="5 5" />
      <line x1="18" y1="12" x2="18" y2="54" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 5" />
    </svg>
  );
}

export function SantaHatSvg({ color = "#FF0000", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <path d="M8 44c0 0 10-30 22-34s22 4 22 4l-4 6c0 0-8-4-16-2S14 38 14 38z" fill={color} stroke="#333" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="6" y="40" width="42" height="10" rx="5" fill="#fff" stroke="#333" strokeWidth="2.5" />
      <circle cx="50" cy="18" r="6" fill="#fff" stroke="#333" strokeWidth="2.5" />
    </svg>
  );
}

export function BouquetSvg({ color = "#FF69B4", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <polygon points="22,34 38,34 34,56 26,56" fill="#98FB98" stroke="#333" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="22" cy="22" r="8" fill={color} stroke="#333" strokeWidth="2" />
      <circle cx="38" cy="22" r="8" fill="#DDA0DD" stroke="#333" strokeWidth="2" />
      <circle cx="30" cy="16" r="8" fill="#FFB6C1" stroke="#333" strokeWidth="2" />
      <circle cx="26" cy="28" r="6" fill="#FF69B4" stroke="#333" strokeWidth="2" />
      <circle cx="34" cy="28" r="6" fill="#E6E6FA" stroke="#333" strokeWidth="2" />
      <path d="M28 34l2 6" stroke="#4CAF50" strokeWidth="1.5" />
      <path d="M32 34l-2 6" stroke="#4CAF50" strokeWidth="1.5" />
    </svg>
  );
}

export function CrownSvg({ color = "#FFD700", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <polygon points="8,44 12,18 22,30 30,10 38,30 48,18 52,44" fill={color} stroke="#333" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="8" y="40" width="44" height="8" rx="1" fill={color} stroke="#333" strokeWidth="2.5" />
      <circle cx="22" cy="44" r="2" fill="#FF0000" stroke="#333" strokeWidth="1" />
      <circle cx="30" cy="44" r="2" fill="#4169E1" stroke="#333" strokeWidth="1" />
      <circle cx="38" cy="44" r="2" fill="#228B22" stroke="#333" strokeWidth="1" />
    </svg>
  );
}

export function PerfumeSvg({ color = "#E6E6FA", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <rect x="20" y="24" width="20" height="28" rx="4" fill={color} stroke="#333" strokeWidth="2.5" />
      <rect x="26" y="16" width="8" height="10" rx="1" fill="#C0C0C0" stroke="#333" strokeWidth="2" />
      <rect x="24" y="12" width="12" height="6" rx="2" fill="#C0C0C0" stroke="#333" strokeWidth="2" />
      <line x1="28" y1="8" x2="32" y2="8" stroke="#C0C0C0" strokeWidth="3" strokeLinecap="round" />
      <rect x="24" y="30" width="12" height="16" rx="2" fill="#fff" opacity="0.3" />
    </svg>
  );
}

export function CardSvg({ color = "#FFB6C1", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <rect x="10" y="10" width="40" height="40" rx="3" fill={color} stroke="#333" strokeWidth="2.5" />
      <path d="M30 38C26 34 18 30 18 24c0-3 2-5 5-5 2 0 4 1 7 4 3-3 5-4 7-4 3 0 5 2 5 5 0 6-8 10-12 14z" fill="#FF0000" stroke="#333" strokeWidth="1.5" />
    </svg>
  );
}

export function RibbonSvg({ color = "#FF69B4", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <path d="M20 10c10 8 10 16 10 20s0 12-10 20" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M40 10c-10 8-10 16-10 20s0 12 10 20" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="30" r="6" fill={color} stroke="#333" strokeWidth="2" />
    </svg>
  );
}

export function CupidSvg({ color = "#FFB6C1", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <circle cx="30" cy="20" r="8" fill={color} stroke="#333" strokeWidth="2" />
      <ellipse cx="30" cy="38" rx="10" ry="12" fill={color} stroke="#333" strokeWidth="2" />
      <circle cx="27" cy="18" r="1.5" fill="#333" />
      <circle cx="33" cy="18" r="1.5" fill="#333" />
      <path d="M28 23c1 1 3 1 4 0" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M18 30c-4-6-6-10-6-10" stroke="#DEB887" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 18l4 2 1-3" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M42 34c4-2 8 0 8 0" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M42 30c4-4 10-2 10-2" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function DaisySvg({ color = "#FFFFFF", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <line x1="30" y1="55" x2="30" y2="32" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <ellipse
          key={angle}
          cx={30 + 10 * Math.cos((angle * Math.PI) / 180)}
          cy={22 + 10 * Math.sin((angle * Math.PI) / 180)}
          rx="6"
          ry="4"
          fill={color}
          stroke="#333"
          strokeWidth="1.5"
          transform={`rotate(${angle} ${30 + 10 * Math.cos((angle * Math.PI) / 180)} ${22 + 10 * Math.sin((angle * Math.PI) / 180)})`}
        />
      ))}
      <circle cx="30" cy="22" r="5" fill="#FFD700" stroke="#333" strokeWidth="1.5" />
    </svg>
  );
}

export function BirdSvg({ color = "#87CEEB", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <ellipse cx="30" cy="30" rx="14" ry="10" fill={color} stroke="#333" strokeWidth="2.5" />
      <circle cx="20" cy="26" r="6" fill={color} stroke="#333" strokeWidth="2.5" />
      <circle cx="18" cy="25" r="2" fill="#333" />
      <polygon points="12,26 6,24 12,28" fill="#FF8C00" stroke="#333" strokeWidth="1.5" />
      <path d="M40 24c4-6 10-8 14-6" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M42 28c4-4 8-4 10-2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
      <line x1="26" y1="40" x2="26" y2="48" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" />
      <line x1="34" y1="40" x2="34" y2="48" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function RainbowSvg({ color = "#FF6347", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      {[
        { r: 24, c: "#FF0000" },
        { r: 20, c: "#FF8C00" },
        { r: 16, c: "#FFD700" },
        { r: 12, c: "#32CD32" },
        { r: 8, c: "#4169E1" },
      ].map(({ r, c }) => (
        <path
          key={r}
          d={`M${30 - r} 44A${r} ${r} 0 0 1 ${30 + r} 44`}
          stroke={c}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function BeachBallSvg({ color = "#FF6347", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <circle cx="30" cy="30" r="20" fill="#fff" stroke="#333" strokeWidth="2.5" />
      <path d="M10 30a20 20 0 0 1 20-20" stroke={color} strokeWidth="8" fill="none" />
      <path d="M50 30a20 20 0 0 1-20 20" stroke={color} strokeWidth="8" fill="none" />
      <path d="M30 10a20 20 0 0 1 20 20" stroke="#4169E1" strokeWidth="8" fill="none" />
      <path d="M30 50a20 20 0 0 1-20-20" stroke="#FFD700" strokeWidth="8" fill="none" />
      <circle cx="30" cy="30" r="20" fill="none" stroke="#333" strokeWidth="2.5" />
    </svg>
  );
}

export function PalmSvg({ color = "#32CD32", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <rect x="27" y="28" width="6" height="28" rx="2" fill="#8B4513" stroke="#333" strokeWidth="2" />
      <path d="M30 28c-8-4-18-2-20 2 4-2 12-1 20 4z" fill={color} stroke="#333" strokeWidth="1.5" />
      <path d="M30 28c8-4 18-2 20 2-4-2-12-1-20 4z" fill={color} stroke="#333" strokeWidth="1.5" />
      <path d="M30 24c-6-8-14-10-16-6 4-1 10 2 16 10z" fill={color} stroke="#333" strokeWidth="1.5" />
      <path d="M30 24c6-8 14-10 16-6-4-1-10 2-16 10z" fill={color} stroke="#333" strokeWidth="1.5" />
      <path d="M30 20c-2-10-6-16-4-18 2 2 4 10 4 22z" fill={color} stroke="#333" strokeWidth="1.5" />
    </svg>
  );
}

export function WavesSvg({ color = "#4169E1", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <path d="M4 24c6-6 12-6 18 0s12 6 18 0 12-6 18 0" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M4 34c6-6 12-6 18 0s12 6 18 0 12-6 18 0" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M4 44c6-6 12-6 18 0s12 6 18 0 12-6 18 0" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export function SpiderWebSvg({ color = "#C0C0C0", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="30"
          y1="30"
          x2={30 + 26 * Math.cos((angle * Math.PI) / 180)}
          y2={30 + 26 * Math.sin((angle * Math.PI) / 180)}
          stroke={color}
          strokeWidth="1.5"
        />
      ))}
      {[8, 14, 20, 26].map((r) => (
        <circle key={r} cx="30" cy="30" r={r} stroke={color} strokeWidth="1" fill="none" />
      ))}
      <circle cx="30" cy="30" r="2" fill="#333" />
    </svg>
  );
}

export function BlackCatSvg({ color = "#2F2F2F", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <ellipse cx="30" cy="40" rx="12" ry="14" fill={color} stroke="#333" strokeWidth="2" />
      <circle cx="30" cy="22" r="10" fill={color} stroke="#333" strokeWidth="2" />
      <polygon points="22,16 18,4 26,12" fill={color} stroke="#333" strokeWidth="2" />
      <polygon points="38,16 42,4 34,12" fill={color} stroke="#333" strokeWidth="2" />
      <circle cx="26" cy="20" r="3" fill="#32CD32" />
      <circle cx="34" cy="20" r="3" fill="#32CD32" />
      <circle cx="26" cy="20" r="1.5" fill="#333" />
      <circle cx="34" cy="20" r="1.5" fill="#333" />
      <path d="M42 44c6 2 12-2 16-6" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function StarBurstSvg({ color = "#FFD700", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const r = i % 2 === 0 ? 24 : 14;
        return (
          <line key={i} x1="30" y1="30" x2={30 + r * Math.cos(angle)} y2={30 + r * Math.sin(angle)} stroke={color} strokeWidth="3" strokeLinecap="round" />
        );
      })}
      <circle cx="30" cy="30" r="8" fill={color} stroke="#333" strokeWidth="2" />
      <text x="30" y="34" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="10" fill="#333" fontWeight="bold">!</text>
    </svg>
  );
}

export function MegaSaleSvg({ color = "#FF0000", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 100 60" className={className} fill="none">
      <polygon points="5,10 95,10 100,30 95,50 5,50 0,30" fill={color} stroke="#333" strokeWidth="2.5" />
      <text x="50" y="24" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="14" fontWeight="bold" fill="#fff">MEGA</text>
      <text x="50" y="44" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="16" fontWeight="bold" fill="#FFD700">SALE!</text>
    </svg>
  );
}

export function ArrowSignSvg({ color = "#FF4500", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <polygon points="10,20 40,20 50,30 40,40 10,40" fill={color} stroke="#333" strokeWidth="2.5" strokeLinejoin="round" />
      <text x="28" y="34" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="12" fill="#fff" fontWeight="bold">GO!</text>
    </svg>
  );
}

export function RulerSvg({ color = "#DEB887", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <rect x="10" y="20" width="40" height="20" rx="2" fill={color} stroke="#333" strokeWidth="2.5" />
      {[14, 20, 26, 32, 38, 44].map((x, i) => (
        <line key={x} x1={x} y1="20" x2={x} y2={i % 2 === 0 ? 30 : 26} stroke="#333" strokeWidth="1.5" />
      ))}
      <text x="16" y="37" fontFamily="'Architects Daughter', cursive" fontSize="8" fill="#333">cm</text>
    </svg>
  );
}

export function AbcSvg({ color = "#FF6347", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <text x="10" y="32" fontFamily="'Architects Daughter', cursive" fontSize="22" fontWeight="bold" fill={color} stroke="#333" strokeWidth="0.5">A</text>
      <text x="24" y="40" fontFamily="'Architects Daughter', cursive" fontSize="22" fontWeight="bold" fill="#4169E1" stroke="#333" strokeWidth="0.5">B</text>
      <text x="38" y="28" fontFamily="'Architects Daughter', cursive" fontSize="22" fontWeight="bold" fill="#32CD32" stroke="#333" strokeWidth="0.5">C</text>
    </svg>
  );
}

export function StarsSvg({ color = "#FFD700", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      {[
        { x: 15, y: 15, s: 8 },
        { x: 40, y: 12, s: 10 },
        { x: 28, y: 35, s: 12 },
        { x: 48, y: 40, s: 7 },
        { x: 12, y: 42, s: 6 },
      ].map(({ x, y, s }, i) => (
        <polygon
          key={i}
          points={Array.from({ length: 5 }).map((_, j) => {
            const angle = (j * 72 - 90) * Math.PI / 180;
            const innerAngle = ((j * 72) + 36 - 90) * Math.PI / 180;
            return `${x + s * Math.cos(angle)},${y + s * Math.sin(angle)} ${x + s * 0.4 * Math.cos(innerAngle)},${y + s * 0.4 * Math.sin(innerAngle)}`;
          }).join(" ")}
          fill={color}
          stroke="#333"
          strokeWidth="1"
          opacity={0.6 + i * 0.1}
        />
      ))}
    </svg>
  );
}

export function BigSunSvg({ color = "#FFD700", size = 60, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
      <circle cx="30" cy="30" r="14" fill={color} stroke="#333" strokeWidth="2.5" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={30 + 18 * Math.cos(angle)}
            y1={30 + 18 * Math.sin(angle)}
            x2={30 + 26 * Math.cos(angle)}
            y2={30 + 26 * Math.sin(angle)}
            stroke={color}
            strokeWidth={i % 2 === 0 ? "3" : "2"}
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="26" cy="28" r="2" fill="#333" />
      <circle cx="34" cy="28" r="2" fill="#333" />
      <path d="M24 34c3 3 9 3 12 0" stroke="#333" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const svgMap: Record<string, (props: SvgProps) => JSX.Element> = {
  "egg": EggSvg,
  "bunny": BunnySvg,
  "flower": FlowerSvg,
  "basket": BasketSvg,
  "chick": ChickSvg,
  "sale-sign": SaleSignSvg,
  "butterfly": ButterflySvg,
  "heart": HeartSvg,
  "gift": GiftSvg,
  "pumpkin": PumpkinSvg,
  "star": StarSvg,
  "snowflake": SnowflakeSvg,
  "xmas-tree": TreeSvg,
  "present": PresentSvg,
  "bat": BatSvg,
  "ghost": GhostSvg,
  "sun": SunSvg,
  "pencil": PencilSvg,
  "notebook": NotebookSvg,
  "backpack": BackpackSvg,
  "rose": RoseSvg,
  "shopping-bag": ShoppingBagSvg,
  "price-tag": PriceTagSvg,
  "percent": PercentSvg,
  "leaf": LeafSvg,
  "ice-cream": IceCreamSvg,
  "candy-cane": CandyCaneSvg,
  "santa-hat": SantaHatSvg,
  "bouquet": BouquetSvg,
  "crown": CrownSvg,
  "perfume": PerfumeSvg,
  "card": CardSvg,
  "ribbon": RibbonSvg,
  "cupid": CupidSvg,
  "daisy": DaisySvg,
  "bird": BirdSvg,
  "rainbow": RainbowSvg,
  "beach-ball": BeachBallSvg,
  "palm": PalmSvg,
  "waves": WavesSvg,
  "spider-web": SpiderWebSvg,
  "black-cat": BlackCatSvg,
  "star-burst": StarBurstSvg,
  "mega-sale": MegaSaleSvg,
  "arrow-sign": ArrowSignSvg,
  "ruler": RulerSvg,
  "abc": AbcSvg,
  "stars": StarsSvg,
  "big-sun": BigSunSvg,
};

export function DoodleIcon({ icon, color, size = 60, className }: { icon: string; color?: string; size?: number; className?: string }) {
  const SvgComponent = svgMap[icon];
  if (!SvgComponent) {
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" className={className} fill="none">
        <rect x="10" y="10" width="40" height="40" rx="4" fill={color || "#ddd"} stroke="#333" strokeWidth="2.5" />
        <text x="30" y="35" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="12" fill="#333">?</text>
      </svg>
    );
  }
  return <SvgComponent color={color} size={size} className={className} />;
}
