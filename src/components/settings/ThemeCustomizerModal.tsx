import React from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { SoundPack, ThemeColor } from '../../types';
import { CatFace } from '../common/CatFace';
import { Palette, Volume2, Sparkles, X, Check } from 'lucide-react';

interface Props {
  onClose: () => void;
}

interface ThemeConfig {
  id: ThemeColor;
  name: string;
  desc: string;
  primaryHex: string;
  accentHex: string;
  secondaryHex: string;
}

export const ThemeCustomizerModal: React.FC<Props> = ({ onClose }) => {
  const { state, setSoundPack, setThemeColor } = useGame();

  const themes: ThemeConfig[] = [
    {
      id: 'midnight',
      name: 'Cosmic Indigo',
      desc: 'Sleek developer indigo, electric cyan & deep cosmic space',
      primaryHex: '#6366F1',
      accentHex: '#06B6D4',
      secondaryHex: '#A855F7',
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Neon',
      desc: 'High-voltage electric cyan, hot magenta & synthwave glow',
      primaryHex: '#00F0FF',
      accentHex: '#FF007F',
      secondaryHex: '#CE82FF',
    },
    {
      id: 'sunset',
      name: 'Sunset Amber',
      desc: 'Warm solar orange, golden forge & fiery crimson glow',
      primaryHex: '#F97316',
      accentHex: '#F59E0B',
      secondaryHex: '#EF4444',
    },
    {
      id: 'emerald-synth',
      name: 'Terminal Matrix',
      desc: 'Hacker phosphor green, retro terminal glow & obsidian',
      primaryHex: '#10B981',
      accentHex: '#38BDF8',
      secondaryHex: '#6366F1',
    },
  ];

  const soundPacks: { id: SoundPack; name: string; desc: string; icon: string }[] = [
    {
      id: 'duolingo',
      name: 'Bhai Harmonic Bells',
      desc: 'Warm harmonic chimes and cheerful chords',
      icon: '🔔',
    },
    {
      id: 'retro-8bit',
      name: 'Retro 8-Bit Arcade',
      desc: 'Vintage chiptune square waves and coin chimes',
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
    document.documentElement.setAttribute('data-theme', theme);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-pop">
      <div className="w-full max-w-lg bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-left">
          <CatFace mood="happy" size="md" />
          <div>
            <span className="text-xs font-black uppercase text-brand-primary tracking-wider">
              Aesthetics & Sound
            </span>
            <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100">
              Personalize CoderBhai
            </h3>
          </div>
        </div>

        {/* Section 1: Color Themes (Truly distinct themes with live swatches!) */}
        <div className="flex flex-col gap-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Theme & Palette
            </span>
            <span className="text-xs font-semibold text-brand-primary">
              Tap to apply instantly
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.map(t => {
              const isSelected =
                state.themeColor === t.id ||
                (t.id === 'midnight' && (!state.themeColor || state.themeColor === 'emerald'));

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTheme(t.id)}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col gap-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-brand-primary shadow-lg ring-2 ring-brand-primary/30 bg-slate-50 dark:bg-slate-800/80'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                      {t.name}
                    </span>
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: t.primaryHex }}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : null}
                  </div>

                  {/* Real Color Swatches */}
                  <div className="flex items-center gap-2 my-0.5">
                    <div
                      className="w-5 h-5 rounded-full shadow-sm border border-black/10"
                      style={{ backgroundColor: t.primaryHex }}
                      title="Primary"
                    />
                    <div
                      className="w-4 h-4 rounded-full shadow-sm border border-black/10"
                      style={{ backgroundColor: t.accentHex }}
                      title="Accent"
                    />
                    <div
                      className="w-4 h-4 rounded-full shadow-sm border border-black/10"
                      style={{ backgroundColor: t.secondaryHex }}
                      title="Secondary"
                    />
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium leading-tight">
                    {t.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Sound Packs */}
        <div className="flex flex-col gap-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-400 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              Sound Effects Pack
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Tap to sample
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
                  className={`btn-3d w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-slate-800 text-brand-primary border-b-4 border-brand-primary ring-2 ring-brand-primary/30'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-b-4 border-slate-200 dark:bg-slate-900/80 dark:text-slate-200 dark:border-slate-950'
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
                    <Check className="w-5 h-5 text-brand-primary" />
                  ) : (
                    <span className="text-xs font-bold text-slate-400">Play</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="btn-3d btn-3d-primary w-full py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider cursor-pointer"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};
