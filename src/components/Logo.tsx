import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showSubtitle = true }) => {
  const dimensions = {
    sm: { height: 28, text: 'text-[18px]', sub: 'text-[9px]' },
    md: { height: 38, text: 'text-[24px]', sub: 'text-[10px]' },
    lg: { height: 52, text: 'text-[36px]', sub: 'text-[12px]' },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Logo Mark: Curved speech bubble + text */}
      <div className="relative flex flex-col">
        {/* Curved coral speech bubble accent matching brand */}
        <svg
          width={size === 'sm' ? 24 : size === 'lg' ? 42 : 32}
          height={size === 'sm' ? 14 : size === 'lg' ? 24 : 18}
          viewBox="0 0 50 30"
          fill="none"
          className="absolute -top-3.5 -left-1 text-[#FF6B5B]"
          aria-hidden="true"
        >
          <path
            d="M8 22C4 18 2 12 6 7C10 2 22 1 32 4C42 7 46 14 43 19C40 24 33 27 26 27C22 27 18 25 15 23"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>

        <div className={`font-display font-black tracking-tight leading-none ${dimensions.text} text-white flex items-baseline`}>
          <span className="font-normal italic mr-1">aur</span>
          <span className="font-bold">Sunao</span>
          <span className="text-[#FF6B5B] ml-0.5">.</span>
        </div>
        {showSubtitle && (
          <div className={`font-sans tracking-widest uppercase opacity-60 ${dimensions.sub} text-white/80 mt-0.5`}>
            tell me more.
          </div>
        )}
      </div>
    </div>
  );
};
