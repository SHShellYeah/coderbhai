import React from 'react';
import { TimedTrainingSection, TimedTrainingSectionProps } from './TimedTrainingSection';

export interface Props extends TimedTrainingSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrainingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialProblemId,
  onOpenArena,
  onBackToHub,
  onCloseHub,
  isActive,
  onStatsUpdated
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-7xl h-[100dvh] sm:h-[95vh] max-h-[100dvh] sm:max-h-[95vh] flex flex-col rounded-none sm:rounded-3xl bg-white dark:bg-[#0B0F19] border-0 sm:border-2 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-left pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] sm:pt-0 sm:pb-0">
        <TimedTrainingSection
          initialProblemId={initialProblemId}
          onOpenArena={onOpenArena}
          onBackToHub={onBackToHub}
          onCloseHub={onCloseHub || onClose}
          isActive={isActive !== undefined ? isActive : isOpen}
          onStatsUpdated={onStatsUpdated}
        />
      </div>
    </div>
  );
};
