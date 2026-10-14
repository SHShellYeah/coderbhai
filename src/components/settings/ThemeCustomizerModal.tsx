import React from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { SoundPack, ThemeColor } from '../../types';
import { Palette, Volume2, Sparkles, X, Check } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const ThemeCustomizerModal: React.FC<Props> = ({ onClose }) => {
  const { state, setSoundPack, setThemeColor } = useGame();

  const themes: { id: ThemeColor; name: string; desc: string; colors: string[] }[] = [
    {
      id: 'emerald',
      name: 'Emerald Classic',
      desc: 'Signature Duolingo vibrant green & gold',
      colors: ['bg-[#58CC02]', '#FFC800', '#1CB0F6'],
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Neon',
      desc: 'Electric cyan, neon purple & gold',
      colors: ['bg-cyan-500', '#CE82FF', '#FF007F'],
    },
    {
      id: 'sunset',
      name: 'Sunset Amber',
      desc: 'Warm orange, crimson & golden glow',
      colors: ['bg-orange-500', '#FF4B4B', '#FFC800'],
    },
    {
      id: 'obsidian',
      name: 'Obsidian OLED',
      desc: 'High contrast sleek dark minimal aesthetic',
      colors: ['bg-slate-900', '#38BDF8', '#A855F7'],
    },
  ];

  const soundPacks: { id: SoundPack; name: string; desc: string; icon: string }[] = [
    {
      id: 'duolingo',
      name: 'Duolingo Classic',
      desc: 'Rich harmonic bells and cheerful major chords',
      icon: '🔔',
    },
    {
      id: 'retro-8bit',
      name: 'Retro 8-Bit Arcade',
      desc: 'Chiptune square waves and vintage coin chimes',
      icon: '👾',
    },
    {
      id: 'arcade-synth',
      name: 'Cyber Synthwave',
      desc: 'Futuristic sawtooth synth waves & arpeggios',
      icon: '⚡',
    },
  ];

  const handleSelectSoundPack = (pack: SoundPack) => {
    setSoundPack(pack);
    sound.setSoundPack(pack);
    sound.playSuccess();
  };

  const handleSelectTheme = (theme: ThemeColor) => {
    sound.playClick();
    setThemeColor(theme);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-pop">
      <div className="w-full max-w-lg bg-white dark:bg-[#1A282F] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-left">
          <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 text-brand-purple flex items-center justify-center">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-brand-purple tracking-wider">
              Aesthetics & Sound
            </span>
            <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100">
              Personalize CodeLingo
            </h3>
          </div>
        </div>

        {/* Section 1: Sound Packs */}
        <div className="flex flex-col gap-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-400 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              Sound Effects Pack
            </span>
            <span className="text-xs font-semibold text-brand-green">
              Tap to sample sound
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {soundPacks.map(pack => {
              const isSelected = state.soundPack === pack.id;
              return (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => handleSelectSoundPack(pack.id)}
                  className={`btn-3d w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all ${
                    isSelected
                      ? 'bg-brand-green/15 text-brand-green border-b-4 border-brand-green ring-2 ring-brand-green/30 dark:bg-brand-green/20'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-b-4 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{pack.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-black">{pack.name}</span>
                      <span className="text-xs text-slate-400 font-medium">
                        {pack.desc}
                      </span>
                    </div>
                  </div>
                  {isSelected ? (
                    <Check className="w-5 h-5 text-brand-green" />
                  ) : (
                    <span className="text-xs font-bold text-slate-400">Play</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Color Themes */}
        <div className="flex flex-col gap-3 text-left">
          <span className="text-xs font-black uppercase text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Accent Palette Theme
          </span>

          <div className="grid grid-cols-2 gap-3">
            {themes.map(t => {
              const isSelected = state.themeColor === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTheme(t.id)}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col gap-2 text-left transition-all ${
                    isSelected
                      ? 'border-brand-green bg-brand-green/10 shadow-md ring-2 ring-brand-green/20'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                      {t.name}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-green" />}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500" />
                    <div className="w-4 h-4 rounded-full bg-amber-400" />
                    <div className="w-4 h-4 rounded-full bg-sky-500" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium leading-tight">
                    {t.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="btn-3d btn-3d-green w-full py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};
