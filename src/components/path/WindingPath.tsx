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
              className={`w-full rounded-3xl p-4 sm:p-5 mb-8 text-white shadow-xl transition-all ${
                isUnitUnlocked ? unit.bannerColor : 'bg-slate-400 dark:bg-slate-800 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-black uppercase tracking-wider bg-black/25 px-2.5 py-0.5 rounded-full">
                      Unit {unit.unitNumber}
                    </span>
                    {!isUnitUnlocked && (
                      <span className="flex items-center gap-1 text-[11px] font-bold bg-black/35 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-black leading-snug">
                    {unit.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-white/90 mt-1">
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
                  className="btn-3d px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-black uppercase flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
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
                      <div className="absolute -top-10 z-20 animate-bounceShort">
                        <div className="bg-white dark:bg-slate-800 text-brand-primary font-black text-xs px-3 py-1.5 rounded-2xl shadow-lg border-2 border-slate-200 dark:border-slate-700 uppercase tracking-wider flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          START (+15 XP)
                        </div>
                        {/* Little triangle arrow */}
                        <div className="w-2.5 h-2.5 bg-white dark:bg-slate-800 rotate-45 mx-auto -mt-1.5 border-r border-b border-slate-200 dark:border-slate-700" />
                      </div>
                    )}

                    {/* Node 3D Button */}
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
                    <span className="mt-2 text-xs font-black tracking-tight text-center max-w-[120px] sm:max-w-[140px] line-clamp-1 text-slate-700 dark:text-slate-300">
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
