import React, { useState, useEffect } from 'react';
import { CourseId, LessonNode, Unit } from '../../types';
import { COURSES } from '../../data/courses';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { ByteCampfire } from './ByteCampfire';
import {
  Star,
  Lock,
  Trophy,
  Zap
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
  const [lockedTooltipNodeId, setLockedTooltipNodeId] = useState<string | null>(null);

  // Winding serpentine offsets matching Duolingo screenshot
  const xOffsets = [12, -26, -56, -26, 16, 52, 20, 0];

  const handleNodeClick = (node: LessonNode, isLocked: boolean) => {
    if (isLocked) {
      sound.playError();
      setLockedTooltipNodeId(node.id);
      setTimeout(() => setLockedTooltipNodeId(null), 2000);
      return;
    }
    sound.playClick();
    onSelectNode(node);
  };

  return (
    <div className="w-full max-w-lg mx-auto py-4 px-2 sm:px-4 flex flex-col items-center select-none overflow-x-hidden">
      {course.units.map((unit, unitIdx) => {
        const isUnitUnlocked = unitIdx < progress.unlockedUnitCount;

        return (
          <div key={unit.id} className="w-full flex flex-col items-center mb-8">
            {/* Unit Header Banner - Sky Blue rounded banner matching Duolingo screenshot */}
            <div
              className={`w-full rounded-2xl p-4 sm:p-5 mb-8 border-b-4 transition-all text-left shadow-md ${
                isUnitUnlocked
                  ? 'bg-[#1CB0F6] border-[#1899D6] text-white'
                  : 'bg-[#18252D] border-[#263843] text-slate-400 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col text-left">
                  <span className="text-[11px] sm:text-xs font-black tracking-wider text-white/80 uppercase mb-0.5">
                    SECTION 2, UNIT {unit.unitNumber}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                    {unit.title}
                  </h2>
                </div>

                {/* Guidebook Button - Notebook icon in rounded bordered box matching screenshot */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveGuidebookUnit(unit);
                  }}
                  className="p-2 sm:p-2.5 rounded-xl border-2 border-white/30 bg-white/10 hover:bg-white/20 active:translate-y-0.5 transition-all text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
                  title="Unit Guidebook"
                  aria-label="Unit Guidebook"
                >
                  <svg className="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                    <line x1="9" y1="7" x2="16" y2="7" strokeLinecap="round" />
                    <line x1="9" y1="11" x2="16" y2="11" strokeLinecap="round" />
                    <line x1="9" y1="15" x2="14" y2="15" strokeLinecap="round" />
                    <circle cx="7" cy="7" r="0.75" fill="currentColor" />
                    <circle cx="7" cy="11" r="0.75" fill="currentColor" />
                    <circle cx="7" cy="15" r="0.75" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Winding Nodes Container */}
            <div className="relative w-full flex flex-col items-center gap-7 py-2">
              {unit.nodes.map((node, nodeIdx) => {
                const isCompleted = progress.completedNodeIds.includes(node.id);
                const isCurrent = progress.currentNodeId === node.id;
                const isLocked = !isUnitUnlocked || (!isCompleted && !isCurrent);

                const offset = xOffsets[nodeIdx % xOffsets.length];

                return (
                  <div
                    key={node.id}
                    className="relative flex flex-col items-center w-full"
                  >
                    {/* Campfire illustration next to node 3/4 matching screenshot */}
                    {nodeIdx === 2 && (
                      <div className="absolute right-3 sm:right-6 top-8 z-0">
                        <ByteCampfire />
                      </div>
                    )}

                    <div
                      className="relative flex flex-col items-center"
                      style={{
                        transform: `translateX(${offset}px)`,
                      }}
                    >
                      {/* Floating "START" Badge above active node */}
                      {isCurrent && (
                        <div className="absolute -top-10 z-20 pointer-events-none animate-bounceShort">
                          <div className="bg-white text-[#131F24] font-black text-[11px] px-3 py-1 rounded-xl shadow-lg uppercase tracking-wider flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-current text-[#FF9600]" />
                            <span>START</span>
                          </div>
                          <div className="w-2.5 h-2.5 bg-white rotate-45 mx-auto -mt-1 shadow-xs" />
                        </div>
                      )}

                      {/* Locked Tooltip on click */}
                      {lockedTooltipNodeId === node.id && (
                        <div className="absolute -top-11 z-30 pointer-events-none animate-pop">
                          <div className="bg-[#263843] border border-[#3C5260] text-slate-200 font-bold text-[11px] px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap">
                            Complete earlier levels to unlock!
                          </div>
                          <div className="w-2 h-2 bg-[#263843] border-r border-b border-[#3C5260] rotate-45 mx-auto -mt-1" />
                        </div>
                      )}

                      {/* Segmented Halo Ring around current active node matching screenshot */}
                      {isCurrent && (
                        <svg
                          className="absolute -inset-3.5 w-[calc(100%+28px)] h-[calc(100%+28px)] pointer-events-none select-none z-0"
                          viewBox="0 0 100 100"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="44"
                            fill="none"
                            stroke="#1CB0F6"
                            strokeWidth="5"
                            strokeDasharray="48 18"
                            strokeDashoffset="12"
                            strokeLinecap="round"
                            opacity="0.95"
                          />
                        </svg>
                      )}

                      {/* Tactile 3D Circular Node Button */}
                      <button
                        type="button"
                        onClick={() => handleNodeClick(node, isLocked)}
                        className={`node-btn w-18 h-18 sm:w-20 sm:h-20 z-10 ${
                          isCompleted
                            ? 'node-completed'
                            : isCurrent
                            ? 'node-current'
                            : 'node-locked'
                        }`}
                        title={
                          isLocked
                            ? 'Locked - Complete earlier lessons'
                            : `${node.title}: ${node.description}`
                        }
                        aria-label={node.title}
                      >
                        {isCompleted ? (
                          // Completed: Golden Star
                          <Star className="w-8 h-8 fill-amber-950 stroke-none" />
                        ) : isCurrent ? (
                          // Active: Sky Blue with Bright White Star
                          <Star className="w-8 h-8 fill-white stroke-none drop-shadow-xs" />
                        ) : (
                          // Locked: Clean Subtle Star
                          <Star className="w-7 h-7 fill-[#4A6475] stroke-none" />
                        )}
                      </button>
                    </div>
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
