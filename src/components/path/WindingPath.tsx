import React, { useState, useEffect } from 'react';
import { CourseId, LessonNode, Unit } from '../../types';
import { COURSES } from '../../data/courses';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { BhaiCompanion } from '../companion/BhaiCompanion';
import {
  Check,
  Star,
  Lock,
  BookOpen,
  Trophy,
  Zap,
  Code,
  Terminal,
  Crown
} from 'lucide-react';
import { UnitGuidebookModal } from './UnitGuidebookModal';

interface Props {
  courseId: CourseId;
  onSelectNode: (node: LessonNode) => void;
}

export const WindingPath: React.FC<Props> = ({ courseId, onSelectNode }) => {
  const { state } = useGame();
  const course = COURSES[courseId] || COURSES.cpp;
  const progress = state.courseProgress[courseId] || {
    completedNodeIds: [],
    currentNodeId: course?.units[0]?.nodes[0]?.id || '',
    placementTaken: false,
    unlockedUnitCount: 1,
  };

  const [activeGuidebookUnit, setActiveGuidebookUnit] = useState<Unit | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Symmetrical serpentine curve oscillating evenly around dead center (0px)
  const xOffsetsDesktop = [0, -38, 0, 38, 0, -38, 0, 38];
  const xOffsetsMobile = [0, -20, 0, 20, 0, -20, 0, 20];
  const xOffsets = isMobile ? xOffsetsMobile : xOffsetsDesktop;

  const getNodeIcon = (node: LessonNode, isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) {
      return <Check className="w-7 h-7 stroke-[3] text-amber-950" />;
    }
    if (isCurrent) {
      return <Crown className="w-7 h-7 fill-white stroke-white animate-bounceShort" />;
    }

    switch (node.iconType) {
      case 'trophy':
        return <Trophy className="w-6 h-6" />;
      case 'terminal':
        return <Terminal className="w-6 h-6" />;
      case 'zap':
        return <Zap className="w-6 h-6" />;
      case 'code':
        return <Code className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const handleNodeClick = (node: LessonNode, isLocked: boolean) => {
    if (isLocked) {
      sound.playError();
      return;
    }
    sound.playClick();
    onSelectNode(node);
  };

  return (
    <div className="w-full max-w-xl mx-auto py-5 px-3 sm:px-4 flex flex-col items-center overflow-x-hidden">
      {/* Bhai the Black Cat Companion (Always keeping you company like Duo!) */}
      <div className="w-full mb-6">
        <BhaiCompanion
          streak={state.streak}
          xp={state.xp}
          activeCourseTitle={course.shortTitle}
        />
      </div>

      {course.units.map((unit, unitIdx) => {
        const isUnitUnlocked = unitIdx < progress.unlockedUnitCount;

        return (
          <div key={unit.id} className="w-full flex flex-col items-center mb-10">
            {/* Unit Header Banner */}
            <div
              className={`w-full rounded-2xl p-4 sm:p-5 mb-8 border transition-all text-left ${
                isUnitUnlocked
                  ? 'bg-slate-900 text-white dark:bg-[#111622] dark:text-slate-100 border-slate-800 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900/60 text-slate-500 border-slate-200 dark:border-slate-800 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/10 dark:bg-slate-800 px-2.5 py-0.5 rounded-full text-slate-200 dark:text-slate-300 border border-white/10 dark:border-slate-700/60">
                      Unit {unit.unitNumber}
                    </span>
                    {!isUnitUnlocked && (
                      <span className="flex items-center gap-1 text-[11px] font-medium bg-black/20 dark:bg-slate-800/80 px-2 py-0.5 rounded-full text-slate-400">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold leading-snug">
                    {unit.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-normal text-slate-300 dark:text-slate-400 mt-1">
                    {unit.description}
                  </p>
                </div>

                {/* Guidebook Button */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveGuidebookUnit(unit);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer border border-white/10 dark:border-slate-700"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Guidebook</span>
                </button>
              </div>
            </div>

            {/* Winding Nodes Container */}
            <div className="relative w-full flex flex-col items-center gap-8 py-2">
              {unit.nodes.map((node, nodeIdx) => {
                const isCompleted = progress.completedNodeIds.includes(node.id);
                const isCurrent = progress.currentNodeId === node.id;
                const isLocked = !isUnitUnlocked || (!isCompleted && !isCurrent);

                const offset = xOffsets[nodeIdx % xOffsets.length];

                return (
                  <div
                    key={node.id}
                    className="relative flex flex-col items-center"
                    style={{
                      transform: `translateX(${offset}px)`,
                    }}
                  >
                    {/* Floating Tooltip/Badge on Active Node */}
                    {isCurrent && (
                      <div className="absolute -top-10 z-20">
                        <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 tracking-wide">
                          <Zap className="w-3.5 h-3.5 fill-current text-amber-400 dark:text-amber-500" />
                          <span>START (+15 XP)</span>
                        </div>
                        {/* Little triangle arrow */}
                        <div className="w-2 h-2 bg-slate-900 dark:bg-white rotate-45 mx-auto -mt-1" />
                      </div>
                    )}

                    {/* Node Button */}
                    <button
                      type="button"
                      onClick={() => handleNodeClick(node, isLocked)}
                      disabled={isLocked}
                      className={`node-btn w-18 h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 ${
                        isCompleted
                          ? 'node-completed'
                          : isCurrent
                          ? 'node-current pulse-glow'
                          : 'node-locked'
                      }`}
                      title={
                        isLocked
                          ? 'Complete earlier lessons to unlock'
                          : `${node.title}: ${node.description}`
                      }
                    >
                      {/* Node Icon */}
                      {isLocked ? (
                        <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400 dark:text-slate-600" />
                      ) : (
                        getNodeIcon(node, isCompleted, isCurrent)
                      )}
                    </button>

                    {/* Node Title Subtext */}
                    <span className="mt-2 text-xs font-medium tracking-tight text-center max-w-[120px] sm:max-w-[140px] line-clamp-1 text-slate-700 dark:text-slate-300">
                      {node.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Guidebook Modal */}
      {activeGuidebookUnit && (
        <UnitGuidebookModal
          unit={activeGuidebookUnit}
          onClose={() => setActiveGuidebookUnit(null)}
        />
      )}
    </div>
  );
};
