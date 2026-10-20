import React from 'react';

export const ByteCampfire: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center select-none pointer-events-none opacity-80 hover:opacity-100 transition-opacity">
      {/* Byte sitting on a stone roasting marshmallow */}
      <svg className="w-32 h-32 sm:w-36 sm:h-36" viewBox="0 0 120 120" fill="none">
        {/* Stone / seat */}
        <ellipse cx="45" cy="98" rx="26" ry="10" fill="#1C2B33" />

        {/* Campfire logs & stones */}
        <ellipse cx="85" cy="100" rx="18" ry="7" fill="#18252D" stroke="#263843" strokeWidth="1.5" />
        <rect x="74" y="93" width="22" height="5" rx="2" transform="rotate(-15 74 93)" fill="#3B2E24" />
        <rect x="76" y="93" width="22" height="5" rx="2" transform="rotate(15 76 93)" fill="#2F231B" />

        {/* Campfire Flame */}
        <path
          d="M85 76c-3 6-8 10-8 16a8 8 0 0 0 16 0c0-6-5-10-8-16Z"
          fill="#FF9600"
          className="animate-pulse"
        />
        <path
          d="M85 82c-1.5 3-4 5-4 8a4 4 0 0 0 8 0c0-3-2.5-5-4-8Z"
          fill="#FFC800"
        />
        <path
          d="M85 86c-.8 1.5-2 2.5-2 4a2 2 0 0 0 4 0c0-1.5-1.2-2.5-2-4Z"
          fill="#1CB0F6"
        />

        {/* Roasting Stick & Marshmallow */}
        <line x1="56" y1="72" x2="82" y2="82" stroke="#6E5542" strokeWidth="2.5" strokeLinecap="round" />
        {/* Marshmallow */}
        <rect x="78" y="79" width="7" height="6" rx="2" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
        {/* Soft toasted marshmallow top */}
        <rect x="80" y="79" width="4" height="2" fill="#D97706" />

        {/* Byte the Cat - Body */}
        <ellipse cx="44" cy="74" rx="16" ry="20" fill="#24343E" />
        {/* White chest bib */}
        <path d="M40 68c0 4 2 8 4 8s4-4 4-8-2-4-4-4-4 0-4 4Z" fill="#3D525F" />

        {/* Byte the Cat - Head */}
        <circle cx="44" cy="48" r="15" fill="#24343E" />
        {/* Cat Ears */}
        <polygon points="32,44 28,30 40,38" fill="#24343E" />
        <polygon points="32,42 30,33 38,39" fill="#3D525F" />
        <polygon points="56,44 60,30 48,38" fill="#24343E" />
        <polygon points="56,42 58,33 50,39" fill="#3D525F" />

        {/* Eyes (Cute sleepy campfire eyes) */}
        <path d="M37 47c1 2 4 2 5 0" stroke="#829DAE" strokeWidth="2" strokeLinecap="round" />
        <path d="M46 47c1 2 4 2 5 0" stroke="#829DAE" strokeWidth="2" strokeLinecap="round" />

        {/* Nose & Whiskers */}
        <polygon points="44,52 42.5,50 45.5,50" fill="#FF86D0" />
        <line x1="33" y1="52" x2="27" y2="50" stroke="#4A6475" strokeWidth="1" />
        <line x1="33" y1="54" x2="27" y2="55" stroke="#4A6475" strokeWidth="1" />
        <line x1="55" y1="52" x2="61" y2="50" stroke="#4A6475" strokeWidth="1" />
        <line x1="55" y1="54" x2="61" y2="55" stroke="#4A6475" strokeWidth="1" />

        {/* Paws holding the stick */}
        <ellipse cx="54" cy="72" rx="3.5" ry="3.5" fill="#24343E" stroke="#3D525F" strokeWidth="1" />

        {/* Warm campfire soft glow on ground */}
        <ellipse cx="85" cy="102" rx="14" ry="4" fill="#FF9600" opacity="0.15" />
      </svg>

      {/* 3 Stars below campfire matching screenshot */}
      <div className="flex items-center gap-1.5 mt-[-10px]">
        <svg className="w-4 h-4 text-[#3C5260] fill-current" viewBox="0 0 24 24">
          <polygon points="12,2 15,8.5 22,9.3 17,14 18.5,21 12,17.3 5.5,21 7,14 2,9.3 9,8.5" />
        </svg>
        <svg className="w-5 h-5 text-[#4A6475] fill-current" viewBox="0 0 24 24">
          <polygon points="12,2 15,8.5 22,9.3 17,14 18.5,21 12,17.3 5.5,21 7,14 2,9.3 9,8.5" />
        </svg>
        <svg className="w-4 h-4 text-[#3C5260] fill-current" viewBox="0 0 24 24">
          <polygon points="12,2 15,8.5 22,9.3 17,14 18.5,21 12,17.3 5.5,21 7,14 2,9.3 9,8.5" />
        </svg>
      </div>
    </div>
  );
};
