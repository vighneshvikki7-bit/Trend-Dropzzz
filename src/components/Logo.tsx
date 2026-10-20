import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
  variant?: 'emblem' | 'icon' | 'horizontal';
}

export const TrendDropLogo: React.FC<LogoProps> = ({
  className = '',
  size = 40,
  variant = 'icon',
}) => {
  // If horizontal variant: Icon + Stylized Brand Typography
  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Circular Emblem Icon */}
        <div className="relative shrink-0 w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 shadow-sm">
          <div className="w-full h-full bg-stone-950 rounded-full flex items-center justify-center overflow-hidden">
            <svg
              viewBox="0 0 100 100"
              className="w-7 h-7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Red speed motion lines */}
              <rect x="14" y="32" width="16" height="3" rx="1.5" fill="#EF233C" />
              <rect x="8" y="40" width="22" height="3" rx="1.5" fill="#EF233C" />
              <rect x="18" y="48" width="12" height="3" rx="1.5" fill="#EF233C" />

              {/* White Shopping Cart */}
              <path
                d="M32 24 L39 24 L48 56 L76 56 L84 32 L44 32"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Cart Wheels */}
              <circle cx="51" cy="67" r="4.5" fill="#FFFFFF" />
              <circle cx="73" cy="67" r="4.5" fill="#FFFFFF" />

              {/* Red Down Arrow into basket */}
              <path
                d="M60 22 L60 40 M52 35 L60 44 L68 35"
                stroke="#EF233C"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Wordmark: Trend Dropzz */}
        <div className="flex flex-col leading-none">
          <div className="flex items-center text-xl sm:text-2xl font-black tracking-tight font-sans">
            <span className="text-stone-900">Trend</span>
            <span className="text-[#EF233C] flex items-center">
              Dr
              <span className="relative inline-flex items-center justify-center">
                o
                <svg
                  className="w-2 h-2 text-white fill-current absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  viewBox="0 0 10 10"
                >
                  <path d="M5 9 L1 4 L4 4 L4 1 L6 1 L6 4 L9 4 Z" fill="#EF233C" />
                </svg>
              </span>
              pzz
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-stone-500 font-semibold mt-0.5">
            Trending Products · Best Deals
          </span>
        </div>
      </div>
    );
  }

  // Full Circular Badge / Emblem
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-full p-[3px] bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 shadow-md ${className}`}
    >
      <div className="w-full h-full bg-[#0A0A0A] rounded-full flex flex-col items-center justify-center text-white p-2 select-none overflow-hidden relative">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circular gradient border is handled by container */}

          {/* Red Speed lines */}
          <rect x="36" y="60" width="30" height="6" rx="3" fill="#EF233C" />
          <rect x="24" y="74" width="42" height="6" rx="3" fill="#EF233C" />
          <rect x="42" y="88" width="24" height="6" rx="3" fill="#EF233C" />

          {/* White Shopping Cart */}
          <path
            d="M58 44 L72 44 L88 98 L142 98 L158 56 L82 56"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Cart Wheels */}
          <circle cx="94" cy="116" r="8" fill="#FFFFFF" />
          <circle cx="136" cy="116" r="8" fill="#FFFFFF" />

          {/* Large Bold Red Down Arrow */}
          <path
            d="M115 36 L115 68 M101 60 L115 76 L129 60"
            stroke="#EF233C"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* TrendDrop Typography */}
          <text
            x="32"
            y="144"
            fill="#FFFFFF"
            fontSize="30"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="-0.5"
          >
            Trend
          </text>
          <text
            x="110"
            y="144"
            fill="#EF233C"
            fontSize="30"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="-0.5"
          >
            Drop
          </text>

          {/* Down arrow inside the O */}
          <path
            d="M149 133 L149 141 M146 138 L149 143 L152 138"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Tagline */}
          <text
            x="100"
            y="160"
            textAnchor="middle"
            fill="#D4D4D8"
            fontSize="7"
            fontWeight="700"
            letterSpacing="2"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            TRENDING PRODUCTS  •  BEST DEALS
          </text>

          {/* Bottom Trust Indicators */}
          <line x1="72" y1="170" x2="72" y2="188" stroke="#3F3F46" strokeWidth="1" />
          <line x1="128" y1="170" x2="128" y2="188" stroke="#3F3F46" strokeWidth="1" />

          <text
            x="50"
            y="182"
            textAnchor="middle"
            fill="#A1A1AA"
            fontSize="5"
            fontWeight="600"
            letterSpacing="0.5"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            QUALITY
          </text>
          <text
            x="50"
            y="189"
            textAnchor="middle"
            fill="#A1A1AA"
            fontSize="5"
            fontWeight="600"
            letterSpacing="0.5"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            PRODUCTS
          </text>

          <text
            x="100"
            y="182"
            textAnchor="middle"
            fill="#A1A1AA"
            fontSize="5"
            fontWeight="600"
            letterSpacing="0.5"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            KERALA
          </text>
          <text
            x="100"
            y="189"
            textAnchor="middle"
            fill="#A1A1AA"
            fontSize="5"
            fontWeight="600"
            letterSpacing="0.5"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            DELIVERY
          </text>

          <text
            x="150"
            y="182"
            textAnchor="middle"
            fill="#A1A1AA"
            fontSize="5"
            fontWeight="600"
            letterSpacing="0.5"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            SAFE & EASY
          </text>
          <text
            x="150"
            y="189"
            textAnchor="middle"
            fill="#A1A1AA"
            fontSize="5"
            fontWeight="600"
            letterSpacing="0.5"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            SHOPPING
          </text>
        </svg>
      </div>
    </div>
  );
};
