import React from 'react';
import { useDsaProgress } from '../../context/DsaProgressContext';
import { DsaRoadmapId } from '../../types/dsa';
import { sound } from '../../utils/audio';
import { Brain, Rocket, ChevronRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface Props {
  onOpenRoadmap: (roadmapId: DsaRoadmapId) => void;
}

export const DsaRoadmapsSection: React.FC<Props> = ({ onOpenRoadmap }) => {
  const { getRoadmapProgress } = useDsaProgress();

  const b75Progress = getRoadmapProgress('blind75');
  const nc150Progress = getRoadmapProgress('neetcode150');

  const handleCardClick = (id: DsaRoadmapId) => {
    sound.playClick();
    onOpenRoadmap(id);
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black shadow-sm text-sm">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight">
              DSA Roadmaps
            </h4>
            <span className="text-[11px] font-semibold text-slate-400">
              Blind 75 &amp; NeetCode 150
            </span>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
          Curated
        </span>
      </div>

      {/* Roadmap Cards Grid */}
      <div className="flex flex-col gap-3">
        {/* Card 1: Blind 75 */}
        <div
          onClick={() => handleCardClick('blind75')}
          className="btn-3d p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-slate-500/5 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-slate-900/40 border-2 border-purple-500/25 hover:border-purple-500/50 transition-all cursor-pointer flex flex-col gap-2.5 group"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧠</span>
              <div>
                <h5 className="text-xs font-black text-slate-800 dark:text-slate-100 group-hover:text-purple-500 transition-colors">
                  Blind 75
                </h5>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  Core 75 Interview Patterns
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-black text-purple-600 dark:text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded-full">
              {b75Progress.percentage}%
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-mono font-bold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                {b75Progress.solved} / {b75Progress.total} Solved
              </span>
              {b75Progress.attempted > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-amber-500 font-mono">
                  <Clock className="w-2.5 h-2.5" />
                  {b75Progress.attempted} in progress
                </span>
              )}
            </div>

            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, b75Progress.percentage)}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick('blind75');
            }}
            className="w-full mt-0.5 py-1.5 px-3 rounded-xl text-xs font-black bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span>Continue Learning</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Card 2: NeetCode 150 */}
        <div
          onClick={() => handleCardClick('neetcode150')}
          className="btn-3d p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-cyan-500/5 to-slate-500/5 dark:from-indigo-950/40 dark:via-cyan-950/30 dark:to-slate-900/40 border-2 border-indigo-500/25 hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col gap-2.5 group"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚀</span>
              <div>
                <h5 className="text-xs font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-500 transition-colors">
                  NeetCode 150
                </h5>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  Comprehensive 18 Topics
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded-full">
              {nc150Progress.percentage}%
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-mono font-bold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                {nc150Progress.solved} / {nc150Progress.total} Solved
              </span>
              {nc150Progress.attempted > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-amber-500 font-mono">
                  <Clock className="w-2.5 h-2.5" />
                  {nc150Progress.attempted} in progress
                </span>
              )}
            </div>

            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, nc150Progress.percentage)}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick('neetcode150');
            }}
            className="w-full mt-0.5 py-1.5 px-3 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span>Continue Learning</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
