import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { tts } from '../../utils/tts';
import { useGame } from '../../context/GameContext';

interface Props {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'icon-only';
  label?: string;
}

export const TTSButton: React.FC<Props> = ({
  text,
  className = '',
  size = 'md',
  label,
}) => {
  const { state } = useGame();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return tts.subscribe((speaking, activeText) => {
      setIsPlaying(speaking && activeText === text);
    });
  }, [text]);

  // Stop TTS if component unmounts
  useEffect(() => {
    return () => {
      if (tts.getActiveText() === text) {
        tts.stop();
      }
    };
  }, [text]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      tts.stop();
    } else {
      tts.speak(text, state.language);
    }
  };

  const isBn = state.language === 'bn';
  const defaultLabel = isPlaying ? (isBn ? 'থামান' : 'Stop') : (isBn ? 'শুনুন' : 'Listen');
  const displayLabel = label || defaultLabel;

  if (size === 'icon-only') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`p-1.5 rounded-xl transition-all cursor-pointer ${
          isPlaying
            ? 'bg-brand-primary text-white shadow-md animate-pulse ring-2 ring-brand-primary/40'
            : 'text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10'
        } ${className}`}
        title={isPlaying ? (isBn ? 'পড়া থামান' : 'Stop reading') : (isBn ? 'পড়ে শুনুন (Text to Speech)' : 'Listen (Text to Speech)')}
      >
        {isPlaying ? (
          <VolumeX className="w-4 h-4 text-white animate-wiggle" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer select-none ${
        isPlaying
          ? 'bg-brand-primary text-white shadow-md ring-2 ring-brand-primary/40'
          : 'bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-brand-primary/25'
      } ${className}`}
      title={isPlaying ? (isBn ? 'পড়া থামান' : 'Stop reading') : (isBn ? 'পড়ে শুনুন (Text to Speech)' : 'Listen (Text to Speech)')}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5 animate-wiggle" />
          <span className="font-extrabold">{displayLabel}</span>
          <span className="flex gap-0.5 items-end h-3 ml-0.5">
            <span className="w-0.5 h-1.5 bg-white rounded-full animate-bounce" />
            <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:0.15s]" />
            <span className="w-0.5 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]" />
          </span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-brand-primary" />
          <span>{displayLabel}</span>
        </>
      )}
    </button>
  );
};
