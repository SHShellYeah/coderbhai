import React from 'react';
import { useDsaProgress } from '../../context/DsaProgressContext';
import { DsaRoadmapId } from '../../types/dsa';
import { sound } from '../../utils/audio';
import { Zap, BookOpen, ChevronRight } from 'lucide-react';

interface Props {
  onOpenSpeedTraining: (tab?: 'hub' | 'timed-training') => void;
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
    <div className="p-4 rounded-xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 shadow-xs text-left flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-medium text-xs">
            <Zap className="w-3.5 h-3.5 fill-current" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">
              Speed Training
            </h4>
            <span className="text-[10px] text-slate-400">
              PBs, Roadmaps &amp; Bank
            </span>
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          HUB
        </span>
      </div>

      {/* Main Hub Launch Card */}
      <button
        type="button"
        onClick={() => {
          sound.playClick();
          onOpenSpeedTraining('hub');
        }}
        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-left transition-colors cursor-pointer group flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <Zap className="w-3.5 h-3.5 fill-current" />
          </div>
          <div className="min-w-0">
            <h5 className="text-xs font-medium text-slate-800 dark:text-slate-100 group-hover:text-amber-500 transition-colors truncate">
              Open Training Hub
            </h5>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal truncate block">
              Overview, quick resume &amp; practice modes
            </span>
          </div>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
      </button>

      {/* Timed Training & PBs Quick Launch */}
      <button
        type="button"
        onClick={() => {
          sound.playClick();
          onOpenSpeedTraining('timed-training');
        }}
        className="w-full py-1.5 px-2.5 rounded-lg text-xs font-medium bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
          <span>Timed Training &amp; PBs</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Quick Access Sub-Cards for Roadmaps */}
      <div className="grid grid-cols-2 gap-2">
        {/* Blind 75 */}
        <div
          onClick={() => {
            sound.playClick();
            if (onOpenRoadmap) onOpenRoadmap('blind75');
            else onOpenSpeedTraining('hub');
          }}
          className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Blind 75
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {b75Progress.percentage}%
              </span>
            </div>
            <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full"
                style={{ width: `${Math.min(100, b75Progress.percentage)}%` }}
              />
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-2">
            {b75Progress.solved}/75 Solved
          </span>
        </div>

        {/* NeetCode 150 */}
        <div
          onClick={() => {
            sound.playClick();
            if (onOpenRoadmap) onOpenRoadmap('neetcode150');
            else onOpenSpeedTraining('hub');
          }}
          className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                NeetCode 150
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {nc150Progress.percentage}%
              </span>
            </div>
            <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full"
                style={{ width: `${Math.min(100, nc150Progress.percentage)}%` }}
              />
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-2">
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
          className="w-full py-1.5 px-2.5 rounded-lg text-xs font-medium bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Community Question Bank</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};
