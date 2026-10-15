import React from 'react';

export type CatMood = 'idle' | 'happy' | 'cheering' | 'thinking' | 'wink' | 'comforting' | 'surprised';

interface CatFaceProps {
  mood?: CatMood;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  animated?: boolean;
}

const sizeMap = {
  xs: 'w-5 h-5',
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
  '2xl': 'w-32 h-32',
};

export const CatFace: React.FC<CatFaceProps> = ({
  mood = 'idle',
  size = 'md',
  className = '',
  animated = true,
}) => {
  const sizeClasses = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${sizeClasses} ${className}`}
      title={`Bhai the Black Cat (${mood})`}
    >
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full drop-shadow-md overflow-visible ${
          animated ? 'transition-transform duration-300 hover:scale-110' : ''
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="catBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="60%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#090D16" />
          </linearGradient>

          <linearGradient id="earInnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>

          <linearGradient id="eyeGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          <linearGradient id="cheerEyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <filter id="catGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- EARS --- */}
        {/* Left Ear */}
        <polygon
          points="20,40 10,8 44,22"
          fill="url(#catBodyGrad)"
          stroke="#334155"
          strokeWidth="2"
          strokeLinejoin="round"
          className={animated ? 'animate-[wiggle_3s_ease-in-out_infinite]' : ''}
          style={{ transformOrigin: '20px 40px' }}
        />
        {/* Left Inner Ear */}
        <polygon
          points="22,36 15,14 38,24"
          fill="url(#earInnerGrad)"
          opacity="0.85"
        />

        {/* Right Ear */}
        <polygon
          points="80,40 90,8 56,22"
          fill="url(#catBodyGrad)"
          stroke="#334155"
          strokeWidth="2"
          strokeLinejoin="round"
          className={animated ? 'animate-[wiggle_3s_ease-in-out_infinite_1.5s]' : ''}
          style={{ transformOrigin: '80px 40px' }}
        />
        {/* Right Inner Ear */}
        <polygon
          points="78,36 85,14 62,24"
          fill="url(#earInnerGrad)"
          opacity="0.85"
        />

        {/* --- HEAD BASE --- */}
        <path
          d="M 18,52 C 16,30 84,30 82,52 C 86,68 80,86 50,86 C 20,86 14,68 18,52 Z"
          fill="url(#catBodyGrad)"
          stroke="#334155"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Forehead Hacker Sparkle Accent */}
        <path
          d="M 50,32 L 51.5,35 L 54.5,36.5 L 51.5,38 L 50,41 L 48.5,38 L 45.5,36.5 L 48.5,35 Z"
          fill="#38BDF8"
          opacity="0.9"
        />

        {/* --- CHEEKS BLUSH --- */}
        {(mood === 'happy' || mood === 'cheering' || mood === 'comforting') && (
          <>
            <ellipse cx="28" cy="64" rx="6" ry="3.5" fill="#FB7185" opacity="0.4" />
            <ellipse cx="72" cy="64" rx="6" ry="3.5" fill="#FB7185" opacity="0.4" />
          </>
        )}

        {/* --- EYES RENDERING ACCORDING TO MOOD --- */}
        {mood === 'idle' && (
          <>
            {/* Left Eye */}
            <ellipse cx="35" cy="52" rx="7.5" ry="9" fill="url(#eyeGlowGrad)" />
            <ellipse cx="35" cy="52" rx="3.5" ry="7.5" fill="#090D16" />
            <circle cx="33" cy="48" r="2.5" fill="#FFFFFF" />
            <circle cx="37" cy="55" r="1.2" fill="#FFFFFF" opacity="0.8" />

            {/* Right Eye */}
            <ellipse cx="65" cy="52" rx="7.5" ry="9" fill="url(#eyeGlowGrad)" />
            <ellipse cx="65" cy="52" rx="3.5" ry="7.5" fill="#090D16" />
            <circle cx="63" cy="48" r="2.5" fill="#FFFFFF" />
            <circle cx="67" cy="55" r="1.2" fill="#FFFFFF" opacity="0.8" />
          </>
        )}

        {mood === 'happy' && (
          <>
            {/* Happy Curved Squint Eyes (^ ^) */}
            <path
              d="M 27,53 Q 35,44 43,53"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 57,53 Q 65,44 73,53"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        )}

        {mood === 'cheering' && (
          <>
            {/* Star Eyes (★ ★) */}
            <polygon
              points="35,45 37,49 42,50 38,53 39,58 35,55 31,58 32,53 28,50 33,49"
              fill="url(#cheerEyeGrad)"
              filter="url(#catGlow)"
            />
            <polygon
              points="65,45 67,49 72,50 68,53 69,58 65,55 61,58 62,53 58,50 63,49"
              fill="url(#cheerEyeGrad)"
              filter="url(#catGlow)"
            />
          </>
        )}

        {mood === 'thinking' && (
          <>
            {/* Left Eye Looking Up */}
            <ellipse cx="36" cy="50" rx="7" ry="8.5" fill="url(#eyeGlowGrad)" />
            <ellipse cx="37" cy="47" rx="3.5" ry="6" fill="#090D16" />
            <circle cx="35" cy="45" r="2.2" fill="#FFFFFF" />

            {/* Right Eye Slightly Squinted */}
            <ellipse cx="64" cy="52" rx="6" ry="6.5" fill="url(#eyeGlowGrad)" />
            <ellipse cx="64" cy="50" rx="3" ry="4.5" fill="#090D16" />
            <circle cx="63" cy="48" r="1.8" fill="#FFFFFF" />
          </>
        )}

        {mood === 'wink' && (
          <>
            {/* Left Eye Open Sparkle */}
            <ellipse cx="35" cy="52" rx="7.5" ry="9" fill="url(#eyeGlowGrad)" />
            <ellipse cx="35" cy="52" rx="3.5" ry="7.5" fill="#090D16" />
            <circle cx="33" cy="48" r="2.5" fill="#FFFFFF" />

            {/* Right Eye Wink (>) */}
            <path
              d="M 58,53 Q 66,45 74,53"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        )}

        {mood === 'comforting' && (
          <>
            {/* Soft Warm Reassuring Eyes */}
            <ellipse cx="35" cy="53" rx="7" ry="8" fill="#818CF8" />
            <ellipse cx="35" cy="53" rx="3.5" ry="6.5" fill="#090D16" />
            <circle cx="34" cy="50" r="2.5" fill="#FFFFFF" />

            <ellipse cx="65" cy="53" rx="7" ry="8" fill="#818CF8" />
            <ellipse cx="65" cy="53" rx="3.5" ry="6.5" fill="#090D16" />
            <circle cx="64" cy="50" r="2.5" fill="#FFFFFF" />
          </>
        )}

        {mood === 'surprised' && (
          <>
            {/* Wide Round Shocked Eyes */}
            <circle cx="35" cy="51" r="9" fill="url(#eyeGlowGrad)" />
            <circle cx="35" cy="51" r="3.5" fill="#090D16" />
            <circle cx="33" cy="47" r="2" fill="#FFFFFF" />

            <circle cx="65" cy="51" r="9" fill="url(#eyeGlowGrad)" />
            <circle cx="65" cy="51" r="3.5" fill="#090D16" />
            <circle cx="63" cy="47" r="2" fill="#FFFFFF" />
          </>
        )}

        {/* --- NOSE --- */}
        <polygon
          points="50,60 46,56 54,56"
          fill="#FB7185"
          stroke="#F43F5E"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />

        {/* --- MOUTH (:3 cute kitty smile) --- */}
        {mood === 'cheering' ? (
          /* Open happy mouth */
          <path
            d="M 46,62 Q 50,70 54,62 Z"
            fill="#FB7185"
            stroke="#F43F5E"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        ) : (
          /* Sweet closed cat curve */
          <path
            d="M 43,62 Q 47,65 50,61 Q 53,65 57,62"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}

        {/* --- WHISKERS --- */}
        {/* Left Whiskers */}
        <line x1="22" y1="58" x2="6" y2="54" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="22" y1="62" x2="7" y2="64" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="23" y1="66" x2="9" y2="72" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />

        {/* Right Whiskers */}
        <line x1="78" y1="58" x2="94" y2="54" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="78" y1="62" x2="93" y2="64" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="77" y1="66" x2="91" y2="72" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
};
