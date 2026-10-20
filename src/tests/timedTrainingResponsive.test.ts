import { describe, it, expect } from 'vitest';
import trainingModalContent from '../components/training/TrainingModal.tsx?raw';
import speedTrainingModalContent from '../components/speed-training/SpeedTrainingModal.tsx?raw';
import timedTrainingSectionContent from '../components/training/TimedTrainingSection.tsx?raw';

describe('Timed Training Mobile Responsiveness Contracts', () => {
  it('1. TrainingModal uses dynamic viewport height and safe-area insets without rigid fixed height', () => {
    expect(trainingModalContent).toContain('100dvh');
    expect(trainingModalContent).toContain('env(safe-area-inset-top)');
    expect(trainingModalContent).toContain('env(safe-area-inset-bottom)');
    expect(trainingModalContent).toContain('rounded-none sm:rounded-3xl');
    expect(trainingModalContent).toContain('p-0 sm:p-4');
  });

  it('2. SpeedTrainingModal uses dynamic viewport height and safe-area insets for mobile views', () => {
    expect(speedTrainingModalContent).toContain('100dvh');
    expect(speedTrainingModalContent).toContain('env(safe-area-inset-top)');
    expect(speedTrainingModalContent).toContain('env(safe-area-inset-bottom)');
    expect(speedTrainingModalContent).toContain('rounded-none sm:rounded-3xl');
  });

  it('3. Top HUD bar provides a responsive 2-row layout on mobile and single-row on desktop', () => {
    expect(timedTrainingSectionContent).toContain('flex flex-col md:flex-row md:items-center md:justify-between');
    expect(timedTrainingSectionContent).toContain('animate-spin-slow');
    expect(timedTrainingSectionContent).toContain('Target:');
  });

  it('4. Action Bar provides touch-friendly targets, flexible widths, and responsive labels', () => {
    // Action bar buttons must have 40px+ touch height (py-2) and flexible shrinkable widths (min-w-0 flex-1)
    expect(timedTrainingSectionContent).toContain('sticky bottom-0 z-20 pb-[max(0.625rem,env(safe-area-inset-bottom))]');
    expect(timedTrainingSectionContent).toContain('flex-1 md:flex-initial min-w-0 py-2 sm:py-1.5');
    expect(timedTrainingSectionContent).toContain('flex-[1.2] md:flex-initial min-w-0 btn-3d btn-3d-yellow py-2 sm:py-1.5');
    expect(timedTrainingSectionContent).toContain('Submit<span className="hidden xs:inline sm:inline"> for Time</span>');
  });

  it('5. Workspace includes mobile segmented switcher ([Problem], [Code], [Tests]) hidden on desktop', () => {
    expect(timedTrainingSectionContent).toContain('flex md:hidden items-center border-b');
    expect(timedTrainingSectionContent).toContain("setMobileTab('problem')");
    expect(timedTrainingSectionContent).toContain("setMobileTab('code')");
    expect(timedTrainingSectionContent).toContain("setMobileTab('tests')");
  });

  it('6. Code editor confines horizontal scrolling without triggering page-wide overflow', () => {
    expect(timedTrainingSectionContent).toContain('wrap="off"');
    expect(timedTrainingSectionContent).toContain('whitespace-pre overflow-x-auto');
    expect(timedTrainingSectionContent).toContain('overscroll-contain');
  });

  it('7. Test results and outputs wrap long continuous text with break-all', () => {
    expect(timedTrainingSectionContent).toContain('break-all');
    expect(timedTrainingSectionContent).toContain('whitespace-pre-wrap');
  });

  it('8. Mobile problem drawer is provided for browsing problems directly from training view', () => {
    expect(timedTrainingSectionContent).toContain('isProblemDrawerOpen');
    expect(timedTrainingSectionContent).toContain('setIsProblemDrawerOpen(true)');
    expect(timedTrainingSectionContent).toContain('filteredDrawerProblems');
    expect(timedTrainingSectionContent).toContain('drawerSheet');
  });

  it('9. Victory screen actions wrap responsively on mobile viewports', () => {
    expect(timedTrainingSectionContent).toContain('flex flex-col sm:flex-row items-stretch sm:items-center justify-center');
  });
});
