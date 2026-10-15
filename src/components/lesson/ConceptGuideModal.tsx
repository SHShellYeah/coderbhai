import React from 'react';
import { LessonNode, Question } from '../../types';
import { CatFace } from '../common/CatFace';
import { sound } from '../../utils/audio';
import { Sparkles, ArrowRight, Lightbulb, Code2, CheckCircle2 } from 'lucide-react';

interface Props {
  node: LessonNode;
  onStartPractice: () => void;
}

export const ConceptGuideModal: React.FC<Props> = ({ node, onStartPractice }) => {
  // Extract teaching details from the node and its first question
  const firstQ = node.questions[0] as Question | undefined;
  const isC = node.id.startsWith('c-') || node.id.includes('c-');
  const isCpp = node.id.startsWith('cpp-') || node.id.includes('cpp-');
  const isPy = node.id.startsWith('python-') || node.id.includes('python-');

  // Friendly conversational explanation
  const getConceptExplanation = () => {
    if (node.description) return node.description;
    if (firstQ?.explanation) return firstQ.explanation;
    return 'Master this essential computer science pattern with step-by-step interactive exercises.';
  };

  const getCodePreview = () => {
    if (firstQ && 'codeSnippet' in firstQ && firstQ.codeSnippet) {
      return firstQ.codeSnippet;
    }
    if (firstQ && 'codeTemplate' in firstQ && firstQ.codeTemplate) {
      return firstQ.codeTemplate.replace(/\{\{blank\d+\}\}/g, '___');
    }
    if (firstQ && 'codeLines' in firstQ && firstQ.codeLines) {
      return firstQ.codeLines.join('\n');
    }
    return isCpp
      ? 'std::cout << "Mastering Code!" << std::endl;'
      : isPy
      ? 'def solution(data):\n    return [x * 2 for x in data]'
      : 'int main(void) {\n    printf("Hello Coder!\\n");\n    return 0;\n}';
  };

  const handleStart = () => {
    sound.playClick();
    onStartPractice();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-pop">
      <div className="w-full max-w-2xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative flex flex-col gap-5 max-h-[92vh] overflow-y-auto text-left">
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-primary/15 text-brand-primary text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Learn with Bhai • Concept Walkthrough
            </span>
          </div>

          <span className="text-xs font-extrabold text-slate-400">
            {node.questions.length} Challenges Ahead
          </span>
        </div>

        {/* Mascot Dialogue Header */}
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shrink-0">
            <CatFace mood="cheering" size="lg" />
          </div>

          <div className="flex-1">
            <span className="text-xs font-black uppercase text-brand-primary tracking-wide block mb-0.5">
              Mentor Bhai's Briefing
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 leading-snug">
              {node.title}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
              {getConceptExplanation()}
            </p>
          </div>
        </div>

        {/* Concept Code Focus Box */}
        <div className="rounded-2xl bg-slate-900 border-2 border-slate-700/60 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700/50">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-slate-400 font-semibold flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5" />
              Key Code Concept
            </span>
            <div className="w-8" />
          </div>

          <pre className="p-3.5 sm:p-5 font-mono text-xs sm:text-sm text-sky-300 leading-relaxed overflow-x-auto whitespace-pre">
            {getCodePreview()}
          </pre>
        </div>

        {/* Key Takeaways & Mental Model Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col gap-2.5">
          <span className="text-xs font-black uppercase text-slate-400 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Bhai's Mental Model (Read Before You Start):
          </span>

          <div className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
            <span>
              {firstQ?.explanation ||
                'Understand how the computer reads each instruction sequentially from top to bottom.'}
            </span>
          </div>

          {firstQ?.mentorTip && (
            <div className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
              <span>{firstQ.mentorTip}</span>
            </div>
          )}
        </div>

        {/* Action Button: Jump into Practice */}
        <button
          type="button"
          onClick={handleStart}
          className="btn-3d btn-3d-primary w-full py-4 rounded-2xl text-base font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          <span>Got It! Let's Practice</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
