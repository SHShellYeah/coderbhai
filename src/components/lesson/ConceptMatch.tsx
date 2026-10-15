import React, { useState, useEffect } from 'react';
import { ConceptMatchQuestion } from '../../types';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { Sparkles, Check } from 'lucide-react';

interface Props {
  question: ConceptMatchQuestion;
  onAllMatched: () => void;
  isAnswerSubmitted: boolean;
}

export const ConceptMatch: React.FC<Props> = ({
  question,
  onAllMatched,
  isAnswerSubmitted,
}) => {
  const { state } = useGame();
  const isBn = state.language === 'bn';

  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [selectedDefId, setSelectedDefId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [shuffledDefs, setShuffledDefs] = useState<{ id: string; definition: string }[]>([]);
  const [mismatch, setMismatch] = useState<{ termId: string; defId: string } | null>(null);

  // Shuffle definitions once on mount
  useEffect(() => {
    const defs = question.pairs.map(p => ({ id: p.id, definition: p.definition }));
    // Fisher-Yates shuffle
    for (let i = defs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [defs[i], defs[j]] = [defs[j], defs[i]];
    }
    setShuffledDefs(defs);
    setMatchedIds(new Set());
    setSelectedTermId(null);
    setSelectedDefId(null);
  }, [question]);

  // Notify parent when all pairs are matched
  useEffect(() => {
    if (question.pairs.length > 0 && matchedIds.size === question.pairs.length) {
      onAllMatched();
    }
  }, [matchedIds.size, question.pairs.length, onAllMatched]);

  const checkPair = (termId: string, defId: string) => {
    if (termId === defId) {
      // Correct match!
      sound.playMatch();
      setMatchedIds(prev => {
        const next = new Set(prev);
        next.add(termId);
        return next;
      });
      setSelectedTermId(null);
      setSelectedDefId(null);
    } else {
      // Mismatch!
      sound.playError();
      setMismatch({ termId, defId });
      setTimeout(() => {
        setMismatch(null);
        setSelectedTermId(null);
        setSelectedDefId(null);
      }, 500);
    }
  };

  const handleTermClick = (id: string) => {
    if (isAnswerSubmitted || matchedIds.has(id)) return;
    sound.playClick();
    if (selectedDefId) {
      checkPair(id, selectedDefId);
    } else {
      setSelectedTermId(id === selectedTermId ? null : id);
    }
  };

  const handleDefClick = (id: string) => {
    if (isAnswerSubmitted || matchedIds.has(id)) return;
    sound.playClick();
    if (selectedTermId) {
      checkPair(selectedTermId, id);
    } else {
      setSelectedDefId(id === selectedDefId ? null : id);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <div className="text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple dark:bg-brand-purple/20 text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          {isBn ? 'কনসেপ্ট মেলান' : 'Concept Match'}
        </div>
        <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
          {question.prompt}
        </h3>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {isBn
            ? 'বাম পাশের বিষয়ের সাথে ডান পাশের সঠিক বর্ণনাটি মেলাতে ট্যাপ করুন:'
            : 'Tap a term on the left and connect it to its correct definition on the right:'}
        </p>
      </div>

      {/* Matching Grid: Terms vs Definitions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1: Terms */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 text-left">
            {isBn ? 'বিষয়সমূহ' : 'Terms'} ({matchedIds.size}/{question.pairs.length})
          </span>
          {question.pairs.map(pair => {
            const isMatched = matchedIds.has(pair.id);
            const isSelected = selectedTermId === pair.id;
            const isWrong = mismatch?.termId === pair.id;

            let cardStyle = 'bg-white text-slate-800 border-b-4 border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-950';
            if (isMatched) {
              cardStyle = 'bg-emerald-500/15 text-emerald-700 border-b-4 border-emerald-500/40 opacity-70 pointer-events-none dark:text-emerald-300';
            } else if (isWrong) {
              cardStyle = 'bg-rose-500/20 text-rose-600 border-b-4 border-rose-500 animate-wiggle';
            } else if (isSelected) {
              cardStyle = 'bg-brand-blue/15 text-brand-blue border-b-4 border-brand-blue ring-2 ring-brand-blue/30';
            }

            return (
              <button
                key={pair.id}
                type="button"
                disabled={isMatched || isAnswerSubmitted}
                onClick={() => handleTermClick(pair.id)}
                className={`btn-3d w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer font-bold ${cardStyle}`}
              >
                <span className="font-mono text-sm md:text-base font-bold">
                  {pair.term}
                </span>
                {isMatched && <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Column 2: Definitions */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 text-left">
            {isBn ? 'বর্ণনাসমূহ' : 'Definitions'}
          </span>
          {shuffledDefs.map(item => {
            const isMatched = matchedIds.has(item.id);
            const isSelected = selectedDefId === item.id;
            const isWrong = mismatch?.defId === item.id;

            let cardStyle = 'bg-white text-slate-700 border-b-4 border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-950';
            if (isMatched) {
              cardStyle = 'bg-emerald-500/15 text-emerald-700 border-b-4 border-emerald-500/40 opacity-70 pointer-events-none dark:text-emerald-300';
            } else if (isWrong) {
              cardStyle = 'bg-rose-500/20 text-rose-600 border-b-4 border-rose-500 animate-wiggle';
            } else if (isSelected) {
              cardStyle = 'bg-brand-blue/15 text-brand-blue border-b-4 border-brand-blue ring-2 ring-brand-blue/30';
            }

            return (
              <button
                key={item.id}
                type="button"
                disabled={isMatched || isAnswerSubmitted}
                onClick={() => handleDefClick(item.id)}
                className={`btn-3d w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer text-xs md:text-sm font-semibold leading-snug ${cardStyle}`}
              >
                <span>{item.definition}</span>
                {isMatched && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
