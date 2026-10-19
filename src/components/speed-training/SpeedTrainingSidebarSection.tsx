import React from 'react';
import { useDsaProgress } from '../../context/DsaProgressContext';
import { DsaRoadmapId } from '../../types/dsa';
import { sound } from '../../utils/audio';
import { Zap, Brain, BookOpen, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

interface Props {
  onOpenSpeedTraining: () => void;
  onOpenRoadmap?: (roadmapId: DsaRoadmapId) => void;
  onOpenQuestionBank?: () => void;
}

export const SpeedTrainingSidebarSection: React.FC<Props> = ({
  onOpenSpeedTraining,
  onOpenRoadmap,
  onOpenQuestionBank,
}) => {
  const { getRoadmapProgress } = useDsaProgress();

  const b75Progress = getRoadmapProgress('blind75');
  const nc150Progress = getRoadmapProgress('neetcode150');

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center font-black shadow-sm text-sm">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight">
              Speed Training
            </h4>
            <span className="text-[11px] font-semibold text-slate-400">
              DSA Roadmaps &amp; Bank
            </span>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">
          HUB
        </span>
      </div>

      {/* Main Hub Launch Card */}
      <button
        type="button"
        onClick={() => {
          sound.playClick();
          onOpenSpeedTraining();
        }}
        className="btn-3d p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 dark:from-amber-950/30 dark:via-purple-950/30 dark:to-indigo-950/20 border border-amber-500/30 hover:border-amber-500/60 text-left transition-all cursor-pointer group flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-sm shrink-0">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div className="min-w-0">
            <h5 className="text-xs font-black text-slate-800 dark:text-slate-100 group-hover:text-amber-500 transition-colors truncate">
              Open Training Hub
            </h5>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate block">
              Overview, quick resume &amp; practice modes
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform shrink-0" />
      </button>

      {/* Quick Access Sub-Cards */}
      <div className="grid grid-cols-2 gap-2">
        {/* Blind 75 */}
        <div
          onClick={() => {
            sound.playClick();
            if (onOpenRoadmap) onOpenRoadmap('blind75');
            else onOpenSpeedTraining();
          }}
          className="p-3 rounded-2xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-purple-600 dark:text-purple-400">
                Blind 75
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {b75Progress.percentage}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${Math.min(100, b75Progress.percentage)}%` }}
              />
            </div>
          </div>
          <span className="text-[10px] font-mono font-semibold text-slate-400 mt-2">
            {b75Progress.solved}/75 Solved
          </span>
        </div>

        {/* NeetCode 150 */}
        <div
          onClick={() => {
            sound.playClick();
            if (onOpenRoadmap) onOpenRoadmap('neetcode150');
            else onOpenSpeedTraining();
          }}
          className="p-3 rounded-2xl bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-500/20 hover:border-indigo-500/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                NeetCode 150
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {nc150Progress.percentage}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${Math.min(100, nc150Progress.percentage)}%` }}
              />
            </div>
          </div>
          <span className="text-[10px] font-mono font-semibold text-slate-400 mt-2">
            {nc150Progress.solved}/150 Solved
          </span>
        </div>
      </div>

      {/* Bank Practice Quick Link */}
      {onOpenQuestionBank && (
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenQuestionBank();
          }}
          className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/25 flex items-center justify-between transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-sky-500" />
            <span>Community Question Bank</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};
